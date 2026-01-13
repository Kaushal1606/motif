import { Button } from "@/components/ui/button";
import { Users, Clapperboard, Video, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAvatars } from "@/hooks/useAvatars";
import { useScenes } from "@/hooks/useScenes";
import { useVideos } from "@/hooks/useVideos";

const Dashboard = () => {
  const { user } = useAuth();
  const { avatars } = useAvatars();
  const { scenes } = useScenes();
  const { videos } = useVideos();

const stats = [
    { label: "Characters", value: avatars.length, icon: Users, path: "/characters" },
    { label: "Scenes", value: scenes.length, icon: Clapperboard, path: "/scenes" },
    { label: "Videos", value: videos.length, icon: Video, path: "/videos" },
  ];

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            to={stat.path}
            className="p-5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm" className="gradient-primary hover:opacity-90">
            <Link to="/characters/new">
              <Plus className="w-4 h-4 mr-2" />
              New Character
            </Link>
          </Button>
          <Button asChild size="sm" className="gradient-secondary hover:opacity-90">
            <Link to="/scenes/new">
              <Plus className="w-4 h-4 mr-2" />
              New Scene
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {avatars.length === 0 && (
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
    </DashboardLayout>
  );
};

export default Dashboard;
