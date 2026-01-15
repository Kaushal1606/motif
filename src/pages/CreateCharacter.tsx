import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { webhookService } from "@/services/webhookService";
import { Loader2 } from "lucide-react";

const visualStyles = ["Realistic", "Anime", "Studio Ghibli", "Cyberpunk", "Watercolor"];
const genders = ["Male", "Female", "Non-binary", "Other"];
const ageRanges = ["Child (5-12)", "Teen (13-17)", "Young Adult (18-25)", "Adult (26-40)", "Middle Age (41-60)", "Senior (60+)"];

const CreateCharacter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { creditUnits, loading: creditsLoading } = useCredits();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    avatar_name: "",
    user_description: "",
    visual_style: "",
    gender: "",
    age_range: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to create a character.",
        variant: "destructive",
      });
      return;
    }

    if (creditUnits < 10) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 0.1 credits to create a character. Please purchase credits.",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }

    if (!formData.avatar_name || !formData.user_description || !formData.visual_style || !formData.gender || !formData.age_range) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await webhookService.createAvatar({
        avatar_name: formData.avatar_name,
        user_description: formData.user_description,
        visual_style: formData.visual_style,
        gender: formData.gender,
        age_range: formData.age_range,
      });

      toast({
        title: "Character created!",
        description: "Your character is being processed. You'll be notified when it's ready.",
      });

      navigate("/characters");
    } catch (error) {
      toast({
        title: "Failed to create character",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Create Character</h1>
          <p className="text-sm text-muted-foreground">
            Define your character's appearance and style
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="avatar_name">Character Name *</Label>
            <Input
              id="avatar_name"
              placeholder="e.g., Alex the Explorer"
              value={formData.avatar_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, avatar_name: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="user_description">Description *</Label>
            <Textarea
              id="user_description"
              placeholder="Describe your character's physical appearance, clothing, and distinctive features..."
              rows={4}
              value={formData.user_description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, user_description: e.target.value }))
              }
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Be as detailed as possible for best results.
            </p>
          </div>

          {/* Visual Style */}
          <div className="space-y-2">
            <Label htmlFor="visual_style">Visual Style *</Label>
            <Select
              value={formData.visual_style}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, visual_style: value }))
              }
              disabled={loading}
            >
              <SelectTrigger id="visual_style">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {visualStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                disabled={loading}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_range">Age Range *</Label>
              <Select
                value={formData.age_range}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, age_range: value }))
                }
                disabled={loading}
              >
                <SelectTrigger id="age_range">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/characters")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary hover:opacity-90" disabled={loading || creditsLoading}>
              {(loading || creditsLoading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {creditsLoading ? "Checking credits..." : "Create Character"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCharacter;
