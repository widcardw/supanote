export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: number
          title: string | null
          user: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: number
          title?: string | null
          user: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: number
          title?: string | null
          user?: string
        }
      },
      notes: {
        Row: {
          id: number
          title: string
          user_id: string
          created_at: Date
          modified_at: Date
          content: string
          directory: string
          metadata: any
          hash: string
        },
        Insert: {
          id?: number
          title: string
          user_id: string
          created_at?: Date
          modified_at?: Date
          content?: string
          directory?: string
          metadata?: any
          hash?: string
        },
        Update: {
          id?: number
          title?: string
          user_id?: string
          created_at?: Date
          modified_at?: Date
          content?: string
          directory?: string
          metadata?: any
          hash?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
