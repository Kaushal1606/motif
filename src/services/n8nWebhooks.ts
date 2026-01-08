const API_ENDPOINTS = {
  createAvatar: "https://n8n.srv1011999.hstgr.cloud/webhook/create-avatar",
  createScene: "https://n8n.srv1011999.hstgr.cloud/webhook/create-scene",
  approveScene: (sceneId: string) => `https://n8n.srv1011999.hstgr.cloud/webhook/97fc9ef9-051b-4d4b-88a4-fe56a82f2f2a/approve-scene/${sceneId}`,
  rejectScene: (sceneId: string) => `https://n8n.srv1011999.hstgr.cloud/webhook/727b2d9e-e4cd-4c41-944a-ea78619f6282/reject-scene/${sceneId}`,
};

export interface CreateAvatarPayload {
  avatar_name: string;
  user_description: string;
  visual_style: string;
  gender: string;
  age_range: string;
  user_email: string;
}

export interface CreateScenePayload {
  avatar_name: string;
  scene_name: string;
  action: string;
  location: string;
  mood_atmosphere: string;
  camera_shot: string;
  visual_style: string;
  user_email: string;
}

export const n8nWebhooks = {
  createAvatar: async (payload: CreateAvatarPayload) => {
    const response = await fetch(API_ENDPOINTS.createAvatar, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create avatar: ${response.statusText}`);
    }

    return response.json();
  },

  createScene: async (payload: CreateScenePayload) => {
    const response = await fetch(API_ENDPOINTS.createScene, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create scene: ${response.statusText}`);
    }

    return response.json();
  },

  approveScene: async (sceneId: string) => {
    const response = await fetch(API_ENDPOINTS.approveScene(sceneId), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to approve scene: ${response.statusText}`);
    }

    return response.json();
  },

  rejectScene: async (sceneId: string) => {
    const response = await fetch(API_ENDPOINTS.rejectScene(sceneId), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to reject scene: ${response.statusText}`);
    }

    return response.json();
  },
};
