export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      avatars: {
        Row: {
          age_range: string | null
          approved_at: string | null
          avatar_name: string
          canonical_description: string | null
          created_at: string | null
          embedding: string | null
          gender: string | null
          id: string
          reference_image_url: string | null
          status: string | null
          user_description: string
          user_email: string
          visual_style: string
        }
        Insert: {
          age_range?: string | null
          approved_at?: string | null
          avatar_name: string
          canonical_description?: string | null
          created_at?: string | null
          embedding?: string | null
          gender?: string | null
          id?: string
          reference_image_url?: string | null
          status?: string | null
          user_description: string
          user_email: string
          visual_style: string
        }
        Update: {
          age_range?: string | null
          approved_at?: string | null
          avatar_name?: string
          canonical_description?: string | null
          created_at?: string | null
          embedding?: string | null
          gender?: string | null
          id?: string
          reference_image_url?: string | null
          status?: string | null
          user_description?: string
          user_email?: string
          visual_style?: string
        }
        Relationships: []
      }
      scenes: {
        Row: {
          action_description: string
          approved_at: string | null
          avatar_id: string | null
          camera_shot: string
          created_at: string | null
          enhanced_prompt: string | null
          first_frame_url: string | null
          id: string
          location: string
          mood_atmosphere: string
          rejected_at: string | null
          scene_name: string
          status: string | null
          user_email: string
          visual_style: string
        }
        Insert: {
          action_description: string
          approved_at?: string | null
          avatar_id?: string | null
          camera_shot: string
          created_at?: string | null
          enhanced_prompt?: string | null
          first_frame_url?: string | null
          id?: string
          location: string
          mood_atmosphere: string
          rejected_at?: string | null
          scene_name: string
          status?: string | null
          user_email: string
          visual_style?: string
        }
        Update: {
          action_description?: string
          approved_at?: string | null
          avatar_id?: string | null
          camera_shot?: string
          created_at?: string | null
          enhanced_prompt?: string | null
          first_frame_url?: string | null
          id?: string
          location?: string
          mood_atmosphere?: string
          rejected_at?: string | null
          scene_name?: string
          status?: string | null
          user_email?: string
          visual_style?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenes_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          credit_units: number | null
          id: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          credit_units?: number | null
          id?: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          credit_units?: number | null
          id?: string
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          scene_id: string | null
          status: string | null
          video_url: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          scene_id?: string | null
          status?: string | null
          video_url: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          scene_id?: string | null
          status?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_scene_id_fkey"
            columns: ["scene_id"]
            isOneToOne: false
            referencedRelation: "scenes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_scene_with_avatar: {
        Args: { scene_uuid: string }
        Returns: {
          action_description: string
          approved_at: string
          avatar_id: string
          avatar_image_url: string
          avatar_name: string
          camera_shot: string
          canonical_description: string
          created_at: string
          enhanced_prompt: string
          first_frame_url: string
          id: string
          location: string
          mood_atmosphere: string
          rejected_at: string
          scene_name: string
          status: string
          user_email: string
          visual_style: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
