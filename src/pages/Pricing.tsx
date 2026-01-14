import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const pricingPlans = [
  {
    name: "Starter Pack",
    credits: 10,
    price: 899,
    amountInPaise: 89900,
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
    amountInPaise: 179900,
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
    amountInPaise: 399900,
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

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { credits, loading: creditsLoading } = useCredits();

  const handlePurchase = (planName: string, amountInPaise: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase credits.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const options = {
      key: "rzp_live_S3eelPpPIh9u0e",
      amount: amountInPaise,
      currency: "INR",
      name: "Motif",
      description: "Credit Pack Purchase",
      prefill: {
        email: user.email || "",
      },
      theme: {
        color: "#f97316",
      },
      handler: function () {
        toast({
          title: "Payment successful!",
          description: "Credits added to your account.",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      },
    };

    const razorpay = new window.Razorpay(options);
    
    razorpay.on("payment.failed", function () {
      toast({
        title: "Payment failed",
        description: "Please try again.",
        variant: "destructive",
      });
    });

    razorpay.open();
  };

  const pricingContent = (
    <div className={user ? "" : "pt-24 pb-16"}>
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            1 credit = 1 video. No subscriptions, pay as you go.
          </p>
          {user && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 bg-card/30">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Your current balance: {creditsLoading ? "..." : credits} credits
              </span>
            </div>
          )}
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
                  onClick={() => handlePurchase(plan.name, plan.amountInPaise)}
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
    </div>
  );

  // Show authenticated layout if user is logged in
  if (user) {
    return <DashboardLayout>{pricingContent}</DashboardLayout>;
  }

  // Show public layout if not logged in
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{pricingContent}</main>
      <Footer />
    </div>
  );
};

export default Pricing;
