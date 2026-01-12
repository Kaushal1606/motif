import { Button } from "@/components/ui/button";
import { Video, Play, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useVideos } from "@/hooks/useVideos";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Videos = () => {
  const { videos, loading } = useVideos();
  const { toast } = useToast();

  const handleDownload = async (videoUrl: string, videoId: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video_${videoId}.mp4`;
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
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Videos</h1>
          <p className="text-sm text-muted-foreground">
            Your generated cinematic videos
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card/30 overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div className="rounded-xl border border-border/40 bg-card/20 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
            <Video className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No videos yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Approve scenes to start generating videos.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to="/scenes">View Scenes</Link>
          </Button>
        </div>
      )}

      {/* Videos Grid */}
      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group rounded-xl border border-border/40 bg-card/30 overflow-hidden"
            >
              {/* Video Player / Thumbnail */}
              <div className="aspect-video bg-muted/30 relative">
                {video.status === "completed" && video.video_url ? (
                  <video
                    src={video.video_url}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={video.status || "processing"} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    {video.duration_seconds ? `${video.duration_seconds}s` : "Processing..."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(video.created_at || "").toLocaleDateString()}
                  </p>
                </div>
                {video.status === "completed" && video.video_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownload(video.video_url, video.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Videos;
