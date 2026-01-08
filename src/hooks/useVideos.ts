import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Video = Tables<"videos">;

export const useVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [user?.email]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setVideos((prev) => [payload.new as Video, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setVideos((prev) =>
              prev.map((video) =>
                video.id === (payload.new as Video).id
                  ? (payload.new as Video)
                  : video
              )
            );
          } else if (payload.eventType === "DELETE") {
            setVideos((prev) =>
              prev.filter((video) => video.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  return { videos, loading, error, refetch: fetchVideos };
};
