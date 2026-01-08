import { Sparkles, Film, Zap, Target } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Character Consistency",
    description: "Your character stays the same across every video. Hair, clothing, features - everything stays locked in.",
  },
  {
    icon: Film,
    title: "Multiple Styles",
    description: "Choose from Anime, Realistic, Studio Ghibli, Cyberpunk, or Watercolor styles for your creations.",
  },
  {
    icon: Zap,
    title: "Fast Generation",
    description: "5-second cinematic clips ready in under 3 minutes. Preview frames generate in seconds.",
  },
  {
    icon: Target,
    title: "Full Control",
    description: "Define action, location, mood, and camera angles. Every detail is in your hands.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full gradient-secondary opacity-10 blur-[120px]" />

      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Create Magic</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed for storytellers, creators, and dreamers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl glass hover:bg-muted/20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
