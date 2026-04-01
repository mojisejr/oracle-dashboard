import { NextResponse } from 'next/server'
import { getTodayWeather } from '@/lib/queries'

/**
 * Spray Decision API
 * 
 * Decision logic based on weather conditions:
 * - Rain >20mm → Wait (chemical wash-off risk)
 * - Temp >32°C → Wait (chemical volatilization)
 * 
 * Note: Wind speed not available in current weather_forecasts schema
 * 
 * Response:
 * - ok: All conditions favorable
 * - caution: Suboptimal but can proceed
 * - wait: Unsafe to spray
 */
export async function GET() {
  try {
    const weatherData = await getTodayWeather()

    if (!weatherData) {
      return NextResponse.json(
        { error: 'Weather data not available' },
        { status: 404 }
      )
    }

    // Cast to any to access DB-specific fields (tc_max, tc_min, rh_percent)
    const weather = weatherData as any
    const reasons: string[] = []
    let decision: 'ok' | 'caution' | 'wait' = 'ok'

    // Extract temperature from DB fields
    const tempMax = weather.tc_max || weather.temp_max || 0
    const tempMin = weather.tc_min || weather.temp_min || 0
    const humidity = weather.rh_percent || weather.humidity_percent || 0

    // Check rain (mm)
    if (weather.rain_mm > 20) {
      decision = 'wait'
      reasons.push(`🌧️ ฝนคาดว่าจะตก ${weather.rain_mm}mm (เสี่ยงยาถูกชะล้าง)`)
    } else if (weather.rain_mm > 5) {
      if (decision === 'ok') decision = 'caution'
      reasons.push(`🌦️ ฝนคาดว่าจะตกเล็กน้อย ${weather.rain_mm}mm`)
    }

    // Check temperature (°C)
    if (tempMax > 32) {
      decision = 'wait'
      reasons.push(`🌡️ อุณหภูมิสูง ${tempMax}°C (เสี่ยงยาระเหย)`)
    } else if (tempMax > 30) {
      if (decision === 'ok') decision = 'caution'
      reasons.push(`🌡️ อุณหภูมิค่อนข้างสูง ${tempMax}°C`)
    }

    // Add positive message if all good
    if (decision === 'ok') {
      reasons.push('✅ สภาพอากาศเหมาะสำหรับพ่นยา')
    }

    return NextResponse.json({
      decision,
      reasons,
      weather: {
        date: weather.forecast_date,
        rain_mm: weather.rain_mm || 0,
        wind_speed_kmh: null, // Not available in current schema
        temp_max: tempMax,
        temp_min: tempMin,
        humidity_percent: humidity,
      }
    })
  } catch (error) {
    console.error('Spray decision API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spray decision' },
      { status: 500 }
    )
  }
}
