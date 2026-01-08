import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAvatars } from "@/hooks/useAvatars";
import { Skeleton } from "@/components/ui/skeleton";

const Characters = () => {
  const { avatars, loading } = useAvatars();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Characters</h1>
          <p className="text-sm text-muted-foreground">
            Manage your AI-generated characters
          </p>
        </div>
        <Button asChild className="gradient-primary hover:opacity-90">
          <Link to="/characters/new">
            <Plus className="w-4 h-4 mr-2" />
            New Character
          </Link>
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card/30 overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && avatars.length === 0 && (
        <div className="rounded-xl border border-border/40 bg-card/20 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No characters yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first character to start generating cinematic videos.
          </p>
          <Button asChild size="sm" className="gradient-primary hover:opacity-90">
            <Link to="/characters/new">Create Character</Link>
          </Button>
        </div>
      )}

      {/* Characters Grid */}
      {!loading && avatars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avatars.map((avatar) => (
            <Link
              key={avatar.id}
              to={`/characters/${avatar.id}`}
              className="group rounded-xl border border-border/40 bg-card/30 overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Image */}
              <div className="aspect-square bg-muted/30 relative overflow-hidden">
                {avatar.reference_image_url ? (
                  <img
                    src={avatar.reference_image_url}
                    alt={avatar.avatar_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={avatar.status || "pending_approval"} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                  {avatar.avatar_name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {avatar.user_description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span className="capitalize">{avatar.visual_style}</span>
                  {avatar.gender && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{avatar.gender}</span>
                    </>
                  )}
                  {avatar.age_range && (
                    <>
                      <span>•</span>
                      <span>{avatar.age_range}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Characters;
