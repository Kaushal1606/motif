import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Avatar = Tables<"avatars">;

export const useAvatars = (onlyApproved = false) => {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvatars = async () => {
    if (!user?.email) return;

    try {
      let query = supabase
        .from("avatars")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (onlyApproved) {
        query = query.eq("status", "approved");
      }

      const { data, error } = await query;

      if (error) throw error;
      setAvatars(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch avatars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, [user?.email, onlyApproved]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel("avatars-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "avatars",
          filter: `user_email=eq.${user.email}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAvatars((prev) => [payload.new as Avatar, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setAvatars((prev) =>
              prev.map((avatar) =>
                avatar.id === (payload.new as Avatar).id
                  ? (payload.new as Avatar)
                  : avatar
              )
            );
          } else if (payload.eventType === "DELETE") {
            setAvatars((prev) =>
              prev.filter((avatar) => avatar.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  return { avatars, loading, error, refetch: fetchAvatars };
};
