import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { webhookService } from "@/services/webhookService";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  MapPin,
  Camera,
  Sparkles,
  Clapperboard,
  Download,
  Video,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Scene = Tables<"scenes">;
type VideoType = Tables<"videos">;

const SceneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [scene, setScene] = useState<Scene | null>(null);
  const [video, setVideo] = useState<VideoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const fetchScene = async () => {
    if (!id) return;

    try {
      const { data: sceneData, error: sceneError } = await supabase
        .from("scenes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (sceneError) throw sceneError;
      setScene(sceneData);

      // Fetch associated video if scene exists
      if (sceneData) {
        const { data: videoData } = await supabase
          .from("videos")
          .select("*")
          .eq("scene_id", id)
          .maybeSingle();

        setVideo(videoData);
      }
    } catch (error) {
      toast({
        title: "Error loading scene",
        description: error instanceof Error ? error.message : "Failed to load scene",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScene();
  }, [id]);

  // Real-time updates for this scene
  useEffect(() => {
    if (!id) return;

    const sceneChannel = supabase
      .channel(`scene-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "scenes",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setScene(payload.new as Scene);
        }
      )
      .subscribe();

    const videoChannel = supabase
      .channel(`video-for-scene-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
          filter: `scene_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setVideo(payload.new as VideoType);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sceneChannel);
      supabase.removeChannel(videoChannel);
    };
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setApproving(true);

    try {
      await webhookService.approveScene(id);
      toast({
        title: "Scene approved!",
        description: "Video generation has started. Check the Videos page when ready.",
      });
    } catch (error) {
      toast({
        title: "Failed to approve scene",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setRejecting(true);

    try {
      await webhookService.rejectScene(id);
      toast({
        title: "Scene rejected",
        description: "This scene has been rejected and will not be processed.",
      });
    } catch (error) {
      toast({
        title: "Failed to reject scene",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setRejecting(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!scene?.first_frame_url) return;

    try {
      const response = await fetch(scene.first_frame_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${scene.scene_name.replace(/\s+/g, "_")}_preview.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your scene preview is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
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

  if (!scene) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <Clapperboard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Scene not found</h2>
          <p className="text-muted-foreground mb-6">
            This scene doesn't exist or you don't have permission to view it.
          </p>
          <Button variant="outline" onClick={() => navigate("/scenes")}>
            Back to Scenes
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isPending = scene.status === "pending_approval";
  const hasCompletedVideo = video && video.status === "completed";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/scenes")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Scenes
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">{scene.scene_name}</h1>
              <StatusBadge status={scene.status || "pending_approval"} />
            </div>
            <p className="text-muted-foreground">{scene.action_description}</p>
          </div>

          {/* Approve/Reject buttons */}
          {isPending && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={rejecting || approving}
                className="text-destructive hover:bg-destructive/10"
              >
                {rejecting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={approving || rejecting}
                className="gradient-primary hover:opacity-90"
              >
                {approving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Approve
              </Button>
            </div>
          )}
        </div>

        {/* Preview Image */}
        <div className="aspect-video bg-muted/30 rounded-xl overflow-hidden mb-8 relative">
          {scene.first_frame_url ? (
            <>
              <img
                src={scene.first_frame_url}
                alt={scene.scene_name}
                className="w-full h-full object-cover"
              />
              {video && video.status === "processing" && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-sm text-foreground">Generating video...</p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <Clapperboard className="w-12 h-12 mb-3" />
              <p className="text-sm">Preview will appear after processing</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          {scene.first_frame_url && (
            <Button onClick={handleDownloadImage} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Preview Image
            </Button>
          )}
          {hasCompletedVideo && (
            <Button asChild className="gradient-primary hover:opacity-90">
              <Link to={`/videos/${video.id}`}>
                <Video className="w-4 h-4 mr-2" />
                View Video
              </Link>
            </Button>
          )}
          {video && video.status === "processing" && (
            <Button variant="outline" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Video Processing...
            </Button>
          )}
        </div>

        {/* Scene Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium">Location</span>
            </div>
            <p className="text-sm">{scene.location}</p>
          </div>

          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">Mood</span>
            </div>
            <p className="text-sm">{scene.mood_atmosphere}</p>
          </div>

          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-xs font-medium">Camera</span>
            </div>
            <p className="text-sm">{scene.camera_shot}</p>
          </div>

          <div className="p-4 rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clapperboard className="w-4 h-4" />
              <span className="text-xs font-medium">Style</span>
            </div>
            <p className="text-sm">{scene.visual_style}</p>
          </div>
        </div>

        {/* Enhanced Prompt */}
        {scene.enhanced_prompt && (
          <div className="mt-6 p-4 rounded-lg border border-border/40 bg-card/30">
            <h3 className="text-sm font-medium mb-2">Enhanced Prompt</h3>
            <p className="text-sm text-muted-foreground">{scene.enhanced_prompt}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SceneDetail;
