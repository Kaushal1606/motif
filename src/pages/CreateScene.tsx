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
import { useAvatars } from "@/hooks/useAvatars";
import { useToast } from "@/hooks/use-toast";
import { n8nWebhooks } from "@/services/n8nWebhooks";
import { Loader2, AlertCircle } from "lucide-react";

const visualStyles = ["Realistic", "Anime", "Studio Ghibli", "Cyberpunk", "Watercolor"];
const cameraShots = [
  "Close-up",
  "Medium Shot",
  "Wide Shot",
  "Over-the-shoulder",
  "Low Angle",
  "High Angle",
  "Tracking Shot",
];
const moodOptions = [
  "Calm & Peaceful",
  "Tense & Suspenseful",
  "Joyful & Uplifting",
  "Dark & Dramatic",
  "Mysterious & Ethereal",
  "Adventurous & Exciting",
];

const CreateScene = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { avatars, loading: avatarsLoading } = useAvatars(true); // Only approved avatars
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    avatar_name: "",
    scene_name: "",
    action: "",
    location: "",
    mood_atmosphere: "",
    camera_shot: "",
    visual_style: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to create a scene.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.avatar_name ||
      !formData.scene_name ||
      !formData.action ||
      !formData.location ||
      !formData.mood_atmosphere ||
      !formData.camera_shot
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await n8nWebhooks.createScene({
        avatar_name: formData.avatar_name,
        scene_name: formData.scene_name,
        action: formData.action,
        location: formData.location,
        mood_atmosphere: formData.mood_atmosphere,
        camera_shot: formData.camera_shot,
        visual_style: formData.visual_style || "Realistic",
        user_email: user.email,
      });

      toast({
        title: "Scene created!",
        description: "Your scene is being processed. You'll be notified when it's ready for review.",
      });

      navigate("/scenes");
    } catch (error) {
      toast({
        title: "Failed to create scene",
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
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Create Scene</h1>
          <p className="text-sm text-muted-foreground">
            Design your video scene with a character and setting
          </p>
        </div>

        {/* No approved avatars warning */}
        {!avatarsLoading && avatars.length === 0 && (
          <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">No approved characters</p>
              <p className="text-sm text-muted-foreground mt-1">
                You need at least one approved character to create a scene.{" "}
                <a href="/characters/new" className="text-primary hover:underline">
                  Create a character
                </a>{" "}
                first.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Character */}
          <div className="space-y-2">
            <Label htmlFor="avatar_name">Character *</Label>
            <Select
              value={formData.avatar_name}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, avatar_name: value }))
              }
              disabled={loading || avatarsLoading}
            >
              <SelectTrigger id="avatar_name">
                <SelectValue placeholder={avatarsLoading ? "Loading..." : "Select a character"} />
              </SelectTrigger>
              <SelectContent>
                {avatars.map((avatar) => (
                  <SelectItem key={avatar.id} value={avatar.avatar_name}>
                    {avatar.avatar_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scene Name */}
          <div className="space-y-2">
            <Label htmlFor="scene_name">Scene Name *</Label>
            <Input
              id="scene_name"
              placeholder="e.g., Morning in the Forest"
              value={formData.scene_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, scene_name: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Action */}
          <div className="space-y-2">
            <Label htmlFor="action">Action Description *</Label>
            <Textarea
              id="action"
              placeholder="Describe what the character is doing in this scene..."
              rows={3}
              value={formData.action}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, action: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Dense forest with morning fog"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Mood & Camera */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood_atmosphere">Mood/Atmosphere *</Label>
              <Select
                value={formData.mood_atmosphere}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, mood_atmosphere: value }))
                }
                disabled={loading}
              >
                <SelectTrigger id="mood_atmosphere">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="camera_shot">Camera Shot *</Label>
              <Select
                value={formData.camera_shot}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, camera_shot: value }))
                }
                disabled={loading}
              >
                <SelectTrigger id="camera_shot">
                  <SelectValue placeholder="Select shot" />
                </SelectTrigger>
                <SelectContent>
                  {cameraShots.map((shot) => (
                    <SelectItem key={shot} value={shot}>
                      {shot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Visual Style */}
          <div className="space-y-2">
            <Label htmlFor="visual_style">Visual Style</Label>
            <Select
              value={formData.visual_style}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, visual_style: value }))
              }
              disabled={loading}
            >
              <SelectTrigger id="visual_style">
                <SelectValue placeholder="Select style (optional)" />
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

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/scenes")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary hover:opacity-90"
              disabled={loading || avatars.length === 0}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Scene
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateScene;
