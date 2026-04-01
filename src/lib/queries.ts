import { supabase } from './supabase'
import type { OrchardActivity, WeatherForecast, LatestActivities } from './types'

/**
 * Get latest activities by type (watering, spraying, fertilizing)
 */
export async function getLatestActivities(): Promise<LatestActivities> {
  // Get latest watering
  const { data: wateringData } = await supabase
    .from('orchard_activities')
    .select('*')
    .eq('activity_type', 'watering')
    .is('deleted_at', null)
    .order('activity_date', { ascending: false })
    .limit(1)
    .single()

  // Get latest spraying
  const { data: sprayingData } = await supabase
    .from('orchard_activities')
    .select('*')
    .eq('activity_type', 'spraying')
    .is('deleted_at', null)
    .order('activity_date', { ascending: false })
    .limit(1)
    .single()

  // Get latest fertilizing (can be fertilizing OR spraying with fertilizer in details)
  const { data: fertilizingData } = await supabase
    .from('orchard_activities')
    .select('*')
    .in('activity_type', ['fertilizing', 'spraying'])
    .not('details->fertilizer', 'is', null)
    .is('deleted_at', null)
    .order('activity_date', { ascending: false })
    .limit(1)
    .single()

  return {
    watering: {
      date: wateringData?.activity_date || null,
      days_since: wateringData ? getDaysSince(wateringData.activity_date) : null,
      plot_name: wateringData?.plot_name || null,
    },
    spraying: {
      date: sprayingData?.activity_date || null,
      days_since: sprayingData ? getDaysSince(sprayingData.activity_date) : null,
      plot_name: sprayingData?.plot_name || null,
      formulation: sprayingData?.details?.formulation || sprayingData?.details?.chemical,
    },
    fertilizing: {
      date: fertilizingData?.activity_date || null,
      days_since: fertilizingData ? getDaysSince(fertilizingData.activity_date) : null,
      plot_name: fertilizingData?.plot_name || null,
      fertilizer_type: fertilizingData?.details?.fertilizer,
    },
  }
}

/**
 * Get today's weather forecast for default location (suan-ban)
 */
export async function getTodayWeather(): Promise<WeatherForecast | null> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('weather_forecasts')
    .select('*')
    .eq('forecast_date', today)
    .eq('location_id', 'suan-ban')
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Get weather forecast for next N days (including today)
 */
export async function getWeatherForecast(days: number = 7): Promise<WeatherForecast[]> {
  const today = new Date().toISOString().split('T')[0]
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)
  const endDateStr = endDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('weather_forecasts')
    .select('*')
    .gte('forecast_date', today)
    .lte('forecast_date', endDateStr)
    .eq('location_id', 'suan-ban')
    .order('forecast_date', { ascending: true })

  if (error || !data) {
    return []
  }

  return data
}

/**
 * Get last spraying activity
 */
export async function getLastSpraying(): Promise<OrchardActivity | null> {
  const { data, error } = await supabase
    .from('orchard_activities')
    .select('*')
    .eq('activity_type', 'spraying')
    .is('deleted_at', null)
    .order('activity_date', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Get latest activity for a specific plot and type
 *
 * Schema: activity_logs table
 * - plot_name: string (suan_ban, suan_lang, etc.)
 * - activity_type: string (watering, spraying, fertilizing)
 * - created_at: timestamp (use instead of activity_date)
 */
export async function getLatestActivity(
  plot: string,
  type: 'watering' | 'spraying' | 'fertilizing' | 'harvesting' | 'pruning' | 'observation'
): Promise<OrchardActivity | null> {
  const { data, error } = await supabase
    .from('activity_logs')           // ← Fixed: Use activity_logs (has data)
    .select('*')
    .eq('plot_name', plot)
    .eq('activity_type', type)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })  // ← Fixed: Use created_at (not activity_date)
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  // Map created_at → activity_date for API consistency
  return {
    ...data,
    activity_date: data.created_at  // ← Map field for API response
  }
}

/**
 * Helper: Calculate days since a given date
 */
function getDaysSince(date: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  
  const diffTime = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}
