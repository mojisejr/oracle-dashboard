// Simple database types placeholder
// In production, generate this with: npx supabase gen types typescript --project-id your-project > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: string
          plot_name: string
          activity_type: string
          created_at: string
          details: Json | null
        }
        Insert: {
          id?: string
          plot_name: string
          activity_type: string
          created_at?: string
          details?: Json | null
        }
        Update: {
          id?: string
          plot_name?: string
          activity_type?: string
          created_at?: string
          details?: Json | null
        }
      }
      weather_forecasts: {
        Row: {
          id: string
          forecast_date: string
          location_id: string
          tc_max: number | null
          tc_min: number | null
          rain_mm: number | null
          rh_percent: number | null
          swdown: number | null
        }
        Insert: {
          id?: string
          forecast_date: string
          location_id: string
          tc_max?: number | null
          tc_min?: number | null
          rain_mm?: number | null
          rh_percent?: number | null
          swdown?: number | null
        }
        Update: {
          id?: string
          forecast_date?: string
          location_id?: string
          tc_max?: number | null
          tc_min?: number | null
          rain_mm?: number | null
          rh_percent?: number | null
          swdown?: number | null
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
