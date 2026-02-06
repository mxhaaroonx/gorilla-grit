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
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      boss_fights: {
        Row: {
          boss_current_hp: number
          boss_max_hp: number
          boss_name: string
          completed_at: string | null
          ends_at: string
          id: string
          is_active: boolean
          is_won: boolean | null
          started_at: string
          user_id: string
        }
        Insert: {
          boss_current_hp?: number
          boss_max_hp?: number
          boss_name?: string
          completed_at?: string | null
          ends_at: string
          id?: string
          is_active?: boolean
          is_won?: boolean | null
          started_at?: string
          user_id: string
        }
        Update: {
          boss_current_hp?: number
          boss_max_hp?: number
          boss_name?: string
          completed_at?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean
          is_won?: boolean | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_streak: number
          display_name: string | null
          gorilla_mood: Database["public"]["Enums"]["gorilla_mood"]
          id: string
          last_task_completed_date: string | null
          level: number
          longest_streak: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          current_streak?: number
          display_name?: string | null
          gorilla_mood?: Database["public"]["Enums"]["gorilla_mood"]
          id?: string
          last_task_completed_date?: string | null
          level?: number
          longest_streak?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          current_streak?: number
          display_name?: string | null
          gorilla_mood?: Database["public"]["Enums"]["gorilla_mood"]
          id?: string
          last_task_completed_date?: string | null
          level?: number
          longest_streak?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          completed_at: string
          id: string
          task_id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          id?: string
          task_id: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          id?: string
          task_id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["task_difficulty"]
          id: string
          is_active: boolean
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["task_difficulty"]
          id?: string
          is_active?: boolean
          task_type?: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["task_difficulty"]
          id?: string
          is_active?: boolean
          task_type?: Database["public"]["Enums"]["task_type"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gorilla_mood: "happy" | "neutral" | "sad"
      task_difficulty: "easy" | "medium" | "hard"
      task_type: "daily" | "timeframe"
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
    Enums: {
      gorilla_mood: ["happy", "neutral", "sad"],
      task_difficulty: ["easy", "medium", "hard"],
      task_type: ["daily", "timeframe"],
    },
  },
} as const
