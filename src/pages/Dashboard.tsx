import { Button } from "@/components/ui/button";
import { Film, Users, Clapperboard, Video, Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const stats = [
    { label: "Characters", value: 0, icon: Users, color: "text-primary" },
    { label: "Scenes", value: 0, icon: Clapperboard, color: "text-secondary" },
    { label: "Videos", value: 0, icon: Video, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Motif</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link to="/characters" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Characters
            </Link>
            <Link to="/scenes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Scenes
            </Link>
            <Link to="/videos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            {user?.email} • Ready to create something cinematic?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="gradient-primary hover:opacity-90">
              <Link to="/characters/new">
                <Plus className="w-4 h-4 mr-2" />
                New Character
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/scenes/new">
                <Plus className="w-4 h-4 mr-2" />
                New Scene
              </Link>
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary opacity-50 mx-auto mb-4 flex items-center justify-center">
            <Film className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start by creating your first character. Once approved, you can create scenes and generate cinematic videos.
          </p>
          <Button asChild className="gradient-primary hover:opacity-90">
            <Link to="/characters/new">
              Create Your First Character
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
