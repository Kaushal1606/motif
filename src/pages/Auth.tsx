import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  const [mode, setMode] = useState<"login" | "signup">(isSignUp ? "signup" : "login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup" && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // TODO: Integrate with Supabase auth
    setTimeout(() => {
      setLoading(false);
      toast({
        title: mode === "signup" ? "Account created!" : "Welcome back!",
        description: "Supabase integration needed for full auth.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full gradient-primary opacity-10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full gradient-secondary opacity-10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Motif</span>
        </Link>

        {/* Auth card */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Sign in to continue creating"
                : "Start creating cinematic videos today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted/50 border-border"
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Auth;
