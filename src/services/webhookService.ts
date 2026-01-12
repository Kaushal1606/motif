import { supabase } from "@/integrations/supabase/client";

export interface CreateAvatarPayload {
  avatar_name: string;
  user_description: string;
  visual_style: string;
  gender: string;
  age_range: string;
}

export interface CreateScenePayload {
  avatar_name: string;
  scene_name: string;
  action: string;
  location: string;
  mood_atmosphere: string;
  camera_shot: string;
  visual_style: string;
}

export const webhookService = {
  createAvatar: async (payload: CreateAvatarPayload) => {
    const { data, error } = await supabase.functions.invoke("create-avatar", {
      body: payload,
    });

    if (error) {
      throw new Error(error.message || "Failed to create avatar");
    }

    return data;
  },

  createScene: async (payload: CreateScenePayload) => {
    const { data, error } = await supabase.functions.invoke("create-scene", {
      body: payload,
    });

    if (error) {
      throw new Error(error.message || "Failed to create scene");
    }

    return data;
  },

  approveScene: async (sceneId: string) => {
    const { data, error } = await supabase.functions.invoke("manage-scene", {
      body: { scene_id: sceneId, action: "approve" },
    });

    if (error) {
      throw new Error(error.message || "Failed to approve scene");
    }

    return data;
  },

  rejectScene: async (sceneId: string) => {
    const { data, error } = await supabase.functions.invoke("manage-scene", {
      body: { scene_id: sceneId, action: "reject" },
    });

    if (error) {
      throw new Error(error.message || "Failed to reject scene");
    }

    return data;
  },
};
