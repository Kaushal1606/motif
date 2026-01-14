import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const pricingPlans = [
  {
    name: "Starter Pack",
    credits: 10,
    price: 899,
    description: "Perfect for trying out",
    features: [
      "10 video generations",
      "All visual styles",
      "Email support",
    ],
    buttonText: "Buy Starter",
    popular: false,
  },
  {
    name: "Creator Pack",
    credits: 25,
    price: 1799,
    description: "Best value for creators",
    features: [
      "25 video generations",
      "All visual styles",
      "Priority support",
      "Save 20%",
    ],
    buttonText: "Buy Creator",
    popular: true,
  },
  {
    name: "Studio Pack",
    credits: 60,
    price: 3999,
    description: "For teams & agencies",
    features: [
      "60 video generations",
      "All visual styles",
      "Priority support",
      "Best per-video rate",
    ],
    buttonText: "Buy Studio",
    popular: false,
  },
];

const handlePurchase = (planName: string, amount: number) => {
  console.log(`Initiating purchase for ${planName} at ₹${amount}`);
  // Razorpay integration will be added here
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              1 credit = 1 video. No subscriptions, pay as you go.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular
                    ? "border-primary/50 shadow-lg shadow-primary/10 scale-105"
                    : "border-border/30"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">₹{plan.price.toLocaleString()}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.credits} Credits
                    </p>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handlePurchase(plan.name, plan.price)}
                    className={`w-full ${
                      plan.popular
                        ? "gradient-primary hover:opacity-90"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Free tier note */}
          <p className="text-center text-muted-foreground mt-12">
            ✨ New users get <span className="text-foreground font-medium">1 free credit</span> to try
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
