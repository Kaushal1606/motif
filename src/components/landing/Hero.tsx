import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import motifLogo from "@/assets/motif-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Subtle background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-teal opacity-[0.08] blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-amber opacity-[0.08] blur-[150px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-12 animate-fade-in">
            <img 
              src={motifLogo} 
              alt="Motif - Cinematic Storytelling" 
              className="h-32 md:h-40 lg:h-48 mx-auto"
            />
          </div>

          {/* Main headline */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-in text-balance leading-tight"
            style={{ animationDelay: "0.15s" }}
          >
            Create Cinematic Videos with{" "}
            <span className="gradient-text">Consistent Characters</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 animate-fade-in leading-relaxed"
            style={{ animationDelay: "0.3s" }}
          >
            Design your character once. Generate unlimited videos. 
            Every scene, same character.
          </p>

          {/* CTA buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.45s" }}
          >
            <Button 
              asChild 
              size="lg" 
              className="gradient-primary text-base px-8 h-12 glow-amber hover:opacity-90 transition-all duration-300 group"
            >
              <Link to="/auth?mode=signup">
                Start Creating
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              asChild
              className="text-base px-8 h-12 text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Style tags */}
          <div 
            className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {["Anime", "Realistic", "Studio Ghibli", "Cyberpunk", "Watercolor"].map((style) => (
              <span
                key={style}
                className="px-4 py-2 rounded-full text-sm text-muted-foreground border border-border/50 hover:border-border hover:text-foreground transition-colors cursor-default"
              >
                {style}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
