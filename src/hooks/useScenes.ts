import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Scene = Tables<"scenes">;

export const useScenes = () => {
  const { user } = useAuth();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScenes = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from("scenes")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScenes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch scenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, [user?.email]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel("scenes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scenes",
          filter: `user_email=eq.${user.email}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setScenes((prev) => [payload.new as Scene, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setScenes((prev) =>
              prev.map((scene) =>
                scene.id === (payload.new as Scene).id
                  ? (payload.new as Scene)
                  : scene
              )
            );
          } else if (payload.eventType === "DELETE") {
            setScenes((prev) =>
              prev.filter((scene) => scene.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  return { scenes, loading, error, refetch: fetchScenes };
};
