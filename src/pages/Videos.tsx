import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Play, Clock, Calendar, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useVideos } from "@/hooks/useVideos";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Scene = Tables<"scenes">;

const Videos = () => {
  const { videos, loading: videosLoading } = useVideos();
  const [scenes, setScenes] = useState<Record<string, Scene>>({});
  const [scenesLoading, setScenesLoading] = useState(true);

  // Fetch all scenes that are associated with videos
  useEffect(() => {
    const fetchScenes = async () => {
      const sceneIds = videos
        .map((v) => v.scene_id)
        .filter((id): id is string => id !== null);

      if (sceneIds.length === 0) {
        setScenesLoading(false);
        return;
      }

      const { data } = await supabase
        .from("scenes")
        .select("*")
        .in("id", sceneIds);

      if (data) {
        const sceneMap: Record<string, Scene> = {};
        data.forEach((scene) => {
          sceneMap[scene.id] = scene;
        });
        setScenes(sceneMap);
      }
      setScenesLoading(false);
    };

    if (!videosLoading && videos.length > 0) {
      fetchScenes();
    } else if (!videosLoading) {
      setScenesLoading(false);
    }
  }, [videos, videosLoading]);

  const loading = videosLoading || scenesLoading;

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
          {videos.map((video) => {
            const scene = video.scene_id ? scenes[video.scene_id] : null;

            return (
              <Link
                key={video.id}
                to={`/videos/${video.id}`}
                className="group rounded-xl border border-border/40 bg-card/30 overflow-hidden hover:border-primary/50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-muted/30 relative overflow-hidden">
                  {scene?.first_frame_url ? (
                    <img
                      src={scene.first_frame_url}
                      alt={scene.scene_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {video.status === "completed" && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={video.status || "processing"} />
                  </div>
                  {video.duration_seconds && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration_seconds}s
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {scene?.scene_name || "Untitled Video"}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {video.created_at
                          ? new Date(video.created_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    {video.duration_seconds && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration_seconds}s</span>
                      </div>
                    )}
                  </div>
                  {scene && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clapperboard className="w-3 h-3" />
                      <span className="line-clamp-1">{scene.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Videos;
