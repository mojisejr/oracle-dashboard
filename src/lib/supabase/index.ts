import { createBrowserSupabaseClient } from './browser'

let supabaseInstance: ReturnType<typeof createBrowserSupabaseClient> | undefined

export const supabase = new Proxy({} as ReturnType<typeof createBrowserSupabaseClient>, {
  get(_target, prop) {
    if (!supabaseInstance) {
      supabaseInstance = createBrowserSupabaseClient()
    }
    return supabaseInstance[prop as keyof typeof supabaseInstance]
  }
})
