import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Video,
  Clapperboard,
  Clock,
  Calendar,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type VideoType = Tables<"videos">;
type Scene = Tables<"scenes">;

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [video, setVideo] = useState<VideoType | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVideo = async () => {
    if (!id) return;

    try {
      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (videoError) throw videoError;
      setVideo(videoData);

      // Fetch associated scene
      if (videoData?.scene_id) {
        const { data: sceneData } = await supabase
          .from("scenes")
          .select("*")
          .eq("id", videoData.scene_id)
          .maybeSingle();

        setScene(sceneData);
      }
    } catch (error) {
      toast({
        title: "Error loading video",
        description: error instanceof Error ? error.message : "Failed to load video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  // Real-time updates for this video
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`video-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "videos",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setVideo(payload.new as VideoType);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleDownload = async () => {
    if (!video?.video_url) return;

    try {
      const response = await fetch(video.video_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${scene?.scene_name?.replace(/\s+/g, "_") || "video"}_${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your video is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the video. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="aspect-video w-full rounded-xl mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!video) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Video not found</h2>
          <p className="text-muted-foreground mb-6">
            This video doesn't exist or you don't have permission to view it.
          </p>
          <Button variant="outline" onClick={() => navigate("/videos")}>
            Back to Videos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/videos")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Videos
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {scene?.scene_name || "Video"}
              </h1>
              <StatusBadge status={video.status || "processing"} />
            </div>
            {scene && (
              <p className="text-muted-foreground">{scene.action_description}</p>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-muted/30 rounded-xl overflow-hidden mb-8">
          {video.status === "completed" && video.video_url ? (
            <video
              src={video.video_url}
              controls
              autoPlay={false}
              className="w-full h-full object-contain bg-black"
              poster={scene?.first_frame_url || undefined}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <Video className="w-12 h-12 mb-3 animate-pulse" />
              <p className="text-sm">Video is processing...</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          {video.status === "completed" && video.video_url && (
            <Button onClick={handleDownload} className="gradient-primary hover:opacity-90">
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
          )}
          {scene && (
            <Button asChild variant="outline">
              <Link to={`/scenes/${scene.id}`}>
                <Clapperboard className="w-4 h-4 mr-2" />
                View Scene
              </Link>
            </Button>
          )}
        </div>

        {/* Video Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Duration</span>
            </div>
            <p className="text-sm">
              {video.duration_seconds ? `${video.duration_seconds} seconds` : "—"}
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Created</span>
            </div>
            <p className="text-sm">
              {video.created_at
                ? new Date(video.created_at).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Video className="w-4 h-4" />
              <span className="text-xs font-medium">Status</span>
            </div>
            <p className="text-sm capitalize">{video.status || "processing"}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoDetail;
