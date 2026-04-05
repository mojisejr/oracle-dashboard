import { supabase } from './supabase'
import type { OrchardActivity, WeatherForecast, LatestActivities } from './types'

/**
 * Get latest activities by type (watering, spraying, fertilizing)
 */
export async function getLatestActivities(): Promise<LatestActivities> {
  // Get latest watering
  const { data: wateringData } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('activity_type', 'watering')
    .order('activity_date', { ascending: false })
    .limit(1)
    .single()

  // Get latest spraying
  const { data: sprayingData } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('activity_type', 'spraying')
    .order('activity_date', { ascending: false })
    .limit(1)
    .single()

  // Get latest fertilizing
  const { data: fertilizingData } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('activity_type', 'fertilizing')
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
 * Get today's weather forecast for a specific location
 * Note: Multiple forecasts may exist for same day, so use .limit(1) instead of .single()
 */
export async function getTodayWeather(
  location: string = 'suan_ban'
): Promise<WeatherForecast | null> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('weather_forecasts')
    .select('*')
    .eq('forecast_date', today)
    .eq('location_id', location)
    .limit(1)

  if (error || !data || data.length === 0) {
    console.error('getTodayWeather error:', error)
    return null
  }

  // Return first record if multiple exist
  return data[0]
}

/**
 * Get weather forecast for next N days (including today)
 *
 * Note: If no data for today, returns latest available forecasts
 * Multiple records may exist for the same day (duplicates),
 * so we deduplicate to ensure 1 record per day.
 */
export async function getWeatherForecast(
  days: number = 7,
  location: string = 'suan_ban'
): Promise<WeatherForecast[]> {
  const today = new Date().toISOString().split('T')[0]
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)
  const endDateStr = endDate.toISOString().split('T')[0]

  // Try to get forecasts from today onwards
  let { data, error } = await supabase
    .from('weather_forecasts')
    .select('*')
    .gte('forecast_date', today)
    .lte('forecast_date', endDateStr)
    .eq('location_id', location)
    .order('forecast_date', { ascending: true })

  if (error) {
    console.error('getWeatherForecast error:', error)
    return []
  }

  // Fallback: If no data from today, get latest available forecasts
  if (!data || data.length === 0) {
    console.warn(`No weather forecast from ${today}, falling back to latest available`)
    
    const { data: latestData, error: latestError } = await supabase
      .from('weather_forecasts')
      .select('*')
      .eq('location_id', location)
      .order('forecast_date', { ascending: false })
      .limit(days)

    if (latestError || !latestData) {
      return []
    }

    data = latestData.reverse() // Reverse to get chronological order
  }

  // Deduplicate: Keep first record for each date
  const uniqueByDate = new Map<string, WeatherForecast>()
  for (const record of data) {
    if (!uniqueByDate.has(record.forecast_date)) {
      uniqueByDate.set(record.forecast_date, record)
    }
  }

  // Convert map back to array and sort by date
  return Array.from(uniqueByDate.values()).sort((a, b) =>
    a.forecast_date.localeCompare(b.forecast_date)
  )
}

/**
 * Get last spraying activity for a specific plot
 * @param plot - Optional plot filter
 */
export async function getLastSpraying(plot?: string): Promise<OrchardActivity | null> {
  let query = supabase
    .from('activity_logs')
    .select('*')
    .eq('activity_type', 'spraying')
    .order('activity_date', { ascending: false })
    .limit(1)

  if (plot) {
    query = query.eq('plot_name', plot)
  }

  const { data, error } = await query.single()

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
 * - NO deleted_at field (not soft-delete enabled)
 */
export async function getLatestActivity(
  plot: string,
  type: 'watering' | 'spraying' | 'fertilizing' | 'harvesting' | 'pruning' | 'observation'
): Promise<OrchardActivity | null> {
  const { data, error } = await supabase
    .from('activity_logs')           // ← Use activity_logs (has data)
    .select('*')
    .eq('plot_name', plot)
    .eq('activity_type', type)
    // ← REMOVED: .is('deleted_at', null) - field doesn't exist in activity_logs
    .order('created_at', { ascending: false })  // ← Use created_at (not activity_date)
    .limit(1)
    .single()

  if (error || !data) {
    console.error('getLatestActivity error:', error)
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
