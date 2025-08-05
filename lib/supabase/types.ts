export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          resume_data: any
          template_id: string
          created_at: string
          updated_at: string
          is_public: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          resume_data: any
          template_id: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          resume_data?: any
          template_id?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
        }
      }
      resume_sections: {
        Row: {
          id: string
          resume_id: string
          section_name: string
          section_data: any
          section_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          section_name: string
          section_data: any
          section_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          section_name?: string
          section_data?: any
          section_order?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}
