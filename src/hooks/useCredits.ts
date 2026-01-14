import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.email) {
        setCredits(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error);
        setCredits(0);
      } else {
        setCredits(data?.credits ?? 0);
      }
      setLoading(false);
    };

    fetchCredits();
  }, [user?.email]);

  return { credits, loading };
};
