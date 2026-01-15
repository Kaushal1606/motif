import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCredits = () => {
  const { user } = useAuth();
  const [creditUnits, setCreditUnits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.email) {
        setCreditUnits(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_credits")
        .select("credit_units")
        .eq("user_email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error);
        setCreditUnits(0);
      } else {
        setCreditUnits(data?.credit_units ?? 0);
      }
      setLoading(false);
    };

    fetchCredits();
  }, [user?.email]);

  // Return credits (units / 100) for display and raw creditUnits for validation
  const credits = creditUnits / 100;

  return { credits, creditUnits, loading };
};
