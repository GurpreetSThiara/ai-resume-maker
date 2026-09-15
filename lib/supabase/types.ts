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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          resume_id: string | null
          slug: string
          title: string
          data: any
          theme: any
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_id?: string | null
          slug: string
          title?: string
          data?: any
          theme?: any
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string | null
          slug?: string
          title?: string
          data?: any
          theme?: any
          is_public?: boolean
          created_at?: string
          updated_at?: string
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
    // Required by supabase-js's GenericSchema constraint. Without it the whole
    // schema fails the constraint and every query result narrows to `never`,
    // which is what produced the "Property 'x' does not exist on type 'never'"
    // errors across the resume queries.
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
