import { Button } from "@/components/ui/button";
import { Plus, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useScenes } from "@/hooks/useScenes";
import { Skeleton } from "@/components/ui/skeleton";

const Scenes = () => {
  const { scenes, loading } = useScenes();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Scenes</h1>
          <p className="text-sm text-muted-foreground">
            Manage your video scenes and compositions
          </p>
        </div>
        <Button asChild className="gradient-primary hover:opacity-90">
          <Link to="/scenes/new">
            <Plus className="w-4 h-4 mr-2" />
            New Scene
          </Link>
        </Button>
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
      {!loading && scenes.length === 0 && (
        <div className="rounded-xl border border-border/40 bg-card/20 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
            <Clapperboard className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No scenes yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first scene to start composing videos.
          </p>
          <Button asChild size="sm" className="gradient-primary hover:opacity-90">
            <Link to="/scenes/new">Create Scene</Link>
          </Button>
        </div>
      )}

      {/* Scenes Grid */}
      {!loading && scenes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene) => (
            <Link
              key={scene.id}
              to={`/scenes/${scene.id}`}
              className="group rounded-xl border border-border/40 bg-card/30 overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Preview */}
              <div className="aspect-video bg-muted/30 relative overflow-hidden">
                {scene.first_frame_url ? (
                  <img
                    src={scene.first_frame_url}
                    alt={scene.scene_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Clapperboard className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={scene.status || "pending_approval"} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                  {scene.scene_name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {scene.action_description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span>{scene.location}</span>
                  <span>•</span>
                  <span>{scene.camera_shot}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Scenes;
