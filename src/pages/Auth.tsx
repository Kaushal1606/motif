import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import motifLogo from "@/assets/motif-logo.png";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignUp = searchParams.get("mode") === "signup";
  const [mode, setMode] = useState<"login" | "signup">(isSignUp ? "signup" : "login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    
    if (mode === "signup" && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password);
        if (error) {
          // Handle specific errors
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to confirm your account.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          // Handle specific errors
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Invalid credentials",
              description: "Email or password is incorrect.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign in failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-teal opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-amber opacity-[0.06] blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src={motifLogo} alt="Motif" className="h-16 w-auto" />
        </Link>

        {/* Auth card */}
        <div className="rounded-xl border border-border/40 bg-card/30 p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold mb-1">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to continue"
                : "Start creating cinematic videos"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted/30 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-muted/30 border-border/50"
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-muted/30 border-border/50"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 transition-opacity"
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
                  className="text-foreground hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-foreground hover:underline"
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
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
