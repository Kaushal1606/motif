import { Button } from "@/components/ui/button";
import { Users, Clapperboard, Video, Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import motifLogo from "@/assets/motif-logo.png";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const stats = [
    { label: "Characters", value: 0, icon: Users },
    { label: "Scenes", value: 0, icon: Clapperboard },
    { label: "Videos", value: 0, icon: Video },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={motifLogo} alt="Motif" className="h-9 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-foreground">
              Dashboard
            </Link>
            <Link to="/characters" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Characters
            </Link>
            <Link to="/scenes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Scenes
            </Link>
            <Link to="/videos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Videos
            </Link>
          </nav>

          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
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
            <Button asChild variant="outline" size="sm">
              <Link to="/scenes/new">
                <Plus className="w-4 h-4 mr-2" />
                New Scene
              </Link>
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-xl border border-border/40 bg-card/20 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No characters yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first character to start generating cinematic videos.
          </p>
          <Button asChild size="sm" className="gradient-primary hover:opacity-90">
            <Link to="/characters/new">
              Create Character
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
