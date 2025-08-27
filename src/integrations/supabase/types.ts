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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      artigos: {
        Row: {
          conteudo: string
          conteudo_align: string
          data_publicacao: string
          id: string
          image_fit: string
          image_focal_x: number
          image_focal_y: number
          imagem_url: string | null
          ordem_exibicao: number | null
          resumo: string
          resumo_align: string
          title_align: string
          titulo: string
          user_id: string
        }
        Insert: {
          conteudo: string
          conteudo_align?: string
          data_publicacao?: string
          id?: string
          image_fit?: string
          image_focal_x?: number
          image_focal_y?: number
          imagem_url?: string | null
          ordem_exibicao?: number | null
          resumo: string
          resumo_align?: string
          title_align?: string
          titulo: string
          user_id: string
        }
        Update: {
          conteudo?: string
          conteudo_align?: string
          data_publicacao?: string
          id?: string
          image_fit?: string
          image_focal_x?: number
          image_focal_y?: number
          imagem_url?: string | null
          ordem_exibicao?: number | null
          resumo?: string
          resumo_align?: string
          title_align?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          data_criacao: string
          descricao: string
          description_align: string
          id: string
          image_fit: string
          image_focal_x: number
          image_focal_y: number
          imagem_url: string | null
          link_codigo: string | null
          link_demo: string | null
          ordem_exibicao: number | null
          tecnologias: string[] | null
          title_align: string
          titulo: string
          user_id: string
        }
        Insert: {
          data_criacao?: string
          descricao: string
          description_align?: string
          id?: string
          image_fit?: string
          image_focal_x?: number
          image_focal_y?: number
          imagem_url?: string | null
          link_codigo?: string | null
          link_demo?: string | null
          ordem_exibicao?: number | null
          tecnologias?: string[] | null
          title_align?: string
          titulo: string
          user_id: string
        }
        Update: {
          data_criacao?: string
          descricao?: string
          description_align?: string
          id?: string
          image_fit?: string
          image_focal_x?: number
          image_focal_y?: number
          imagem_url?: string | null
          link_codigo?: string | null
          link_demo?: string | null
          ordem_exibicao?: number | null
          tecnologias?: string[] | null
          title_align?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          cv_mime_type: string | null
          cv_path: string | null
          cv_size: number | null
          email: string | null
          endereco: string | null
          github_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          telefone: string | null
          twitter_url: string | null
          updated_at: string
          updated_by: string | null
          whatsapp: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          cv_mime_type?: string | null
          cv_path?: string | null
          cv_size?: number | null
          email?: string | null
          endereco?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          telefone?: string | null
          twitter_url?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          cv_mime_type?: string | null
          cv_path?: string | null
          cv_size?: number | null
          email?: string | null
          endereco?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          telefone?: string | null
          twitter_url?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
