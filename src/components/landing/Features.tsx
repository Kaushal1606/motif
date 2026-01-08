import { Users, Palette, Zap, SlidersHorizontal } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Character Consistency",
    description: "Your character stays identical across every video—hair, clothing, features, all locked in.",
  },
  {
    icon: Palette,
    title: "Multiple Styles",
    description: "Anime, Realistic, Studio Ghibli, Cyberpunk, or Watercolor. Pick your aesthetic.",
  },
  {
    icon: Zap,
    title: "Fast Generation",
    description: "5-second cinematic clips ready in under 3 minutes. Previews in seconds.",
  },
  {
    icon: SlidersHorizontal,
    title: "Full Control",
    description: "Define action, location, mood, and camera angles. Every detail is yours.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Everything you need to <span className="gradient-text">create</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Powerful AI tools designed for storytellers and creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl border border-border/40 bg-card/30 hover:border-border/80 hover:bg-card/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
