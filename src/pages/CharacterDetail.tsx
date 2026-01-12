import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  User,
  Palette,
  Users as UsersIcon,
  Calendar,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Avatar = Tables<"avatars">;

const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAvatar = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("avatars")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setAvatar(data);
    } catch (error) {
      toast({
        title: "Error loading character",
        description: error instanceof Error ? error.message : "Failed to load character",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [id]);

  // Real-time updates for this avatar
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`avatar-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "avatars",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setAvatar(payload.new as Avatar);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleDownload = async () => {
    if (!avatar?.reference_image_url) {
      toast({
        title: "No image available",
        description: "This character doesn't have a reference image yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(avatar.reference_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${avatar.avatar_name.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your character image is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!avatar) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Character not found</h2>
          <p className="text-muted-foreground mb-6">
            This character doesn't exist or you don't have permission to view it.
          </p>
          <Button variant="outline" onClick={() => navigate("/characters")}>
            Back to Characters
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/characters")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Characters
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden relative">
              {avatar.reference_image_url ? (
                <img
                  src={avatar.reference_image_url}
                  alt={avatar.avatar_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <User className="w-16 h-16 mb-3" />
                  <p className="text-sm">Image processing...</p>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <StatusBadge status={avatar.status || "pending_approval"} />
              </div>
            </div>

            {/* Download Button */}
            {avatar.reference_image_url && (
              <Button
                onClick={handleDownload}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                {avatar.avatar_name}
              </h1>
              <p className="text-muted-foreground">{avatar.user_description}</p>
            </div>

            {/* Canonical Description */}
            {avatar.canonical_description && (
              <div className="p-4 rounded-lg border border-border/40 bg-card/30">
                <h3 className="text-sm font-medium mb-2">Enhanced Description</h3>
                <p className="text-sm text-muted-foreground">
                  {avatar.canonical_description}
                </p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/40 bg-card/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Palette className="w-4 h-4" />
                  <span className="text-xs font-medium">Visual Style</span>
                </div>
                <p className="text-sm">{avatar.visual_style}</p>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-card/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <UsersIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">Gender</span>
                </div>
                <p className="text-sm">{avatar.gender || "Not specified"}</p>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-card/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Age Range</span>
                </div>
                <p className="text-sm">{avatar.age_range || "Not specified"}</p>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-card/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Created</span>
                </div>
                <p className="text-sm">
                  {new Date(avatar.created_at || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CharacterDetail;
