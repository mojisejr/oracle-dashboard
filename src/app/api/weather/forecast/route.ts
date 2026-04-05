import { NextResponse } from 'next/server'
import { getWeatherForecast } from '@/lib/queries'

/**
 * Weather Forecast API
 *
 * Returns 7-day weather forecast for specified location
 *
 * Query Parameters:
 * - location: Plot location (default: suan_ban)
 *
 * Available data (from TMD provider):
 * - Temperature: tc_max, tc_min (°C)
 * - Rain: rain_mm
 * - Humidity: rh_percent
 * - Solar Radiation: swdown (W/m²)
 *
 * Not available:
 * - Wind speed/direction (not in TMD dataset)
 * - UV index
 * - Atmospheric pressure
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'suan_ban'

    const forecast = await getWeatherForecast(7, location)

    if (!forecast || forecast.length === 0) {
      return NextResponse.json(
        { error: 'Weather forecast not available' },
        { status: 404 }
      )
    }

    // Transform to clean API response
    const data = forecast.map(day => ({
      date: day.forecast_date,
      temp_max: day.tc_max || 0,
      temp_min: day.tc_min || 0,
      rain_mm: day.rain_mm || 0,
      humidity_percent: day.rh_percent || 0,
      solar_radiation: day.swdown || 0, // W/m²
      location: day.location_id,
    }))

    return NextResponse.json({
      location: location,
      forecast: data,
      provider: 'tmd',
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Weather forecast API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather forecast' },
      { status: 500 }
    )
  }
}
