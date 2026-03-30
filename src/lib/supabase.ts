import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient<Database>({
  url: supabaseUrl,
  key: supabaseKey,
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Helper function to get Supabase client
export function getSupabase() {
  return supabase
}

// Type for Supabase client
export type { SupabaseClient: typeof supabase }
