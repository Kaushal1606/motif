import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full gradient-primary opacity-20 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full gradient-secondary opacity-20 blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Video Creation</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Create Cinematic Videos with{" "}
            <span className="gradient-text">Consistent Characters</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Design your character once. Generate unlimited videos. Every scene, same character.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="gradient-primary text-lg px-8 py-6 glow-primary hover:opacity-90 transition-opacity">
              <Link to="/auth">
                Start Creating Free
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-muted hover:bg-muted/50">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Preview showcase */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { style: "Anime", color: "from-pink-500/20 to-purple-500/20" },
              { style: "Cinematic", color: "from-primary/20 to-accent/20" },
              { style: "Ghibli", color: "from-green-500/20 to-teal-500/20" },
            ].map((item, i) => (
              <div
                key={item.style}
                className={`relative aspect-video rounded-xl overflow-hidden glass group cursor-pointer animate-float`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-primary ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 text-foreground">
                    {item.style}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
