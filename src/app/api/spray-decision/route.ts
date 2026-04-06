import { NextResponse } from 'next/server'
import { getTodayWeather, getLastSpraying } from '@/lib/queries'

// Force dynamic rendering (route uses request.url)
export const dynamic = 'force-dynamic'

/**
 * Spray Decision API
 *
 * Decision logic based on weather conditions + activity interval:
 * - Activity interval < 7 days → Caution (over-spraying risk)
 * - Rain >20mm → Wait (chemical wash-off risk)
 * - Temp >32°C → Caution (chemical volatilization, NOT wait)
 *
 * Note: Wind speed not available in TMD weather provider
 *
 * Response:
 * - ok: All conditions favorable
 * - caution: Suboptimal but can proceed
 * - wait: Unsafe to spray
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const plot = searchParams.get('plot') || 'suan_ban'

    // Check activity interval (ground truth: 7-day minimum)
    const lastSpraying = await getLastSpraying(plot)
    const daysSince = lastSpraying ? getDaysSince(lastSpraying.activity_date) : null

    if (daysSince !== null && daysSince < 7 && lastSpraying) {
      // Get weather for context
      const weatherData = await getTodayWeather(plot)
      
      return NextResponse.json({
        decision: 'caution',
        reasons: [
          `⏰ พ่นยาไปแล้ว ${daysSince} วันที่แล้ว`,
          `แนะนำช่วง 7-14 วัน (ขั้นต่ำ 7 วัน)`,
          `วันที่พ่น: ${lastSpraying.activity_date}`
        ],
        weather: weatherData ? {
          date: weatherData.forecast_date,
          rain_mm: weatherData.rain_mm || 0,
          wind_speed_kmh: null,
          temp_max: weatherData.tc_max || 0,
          temp_min: weatherData.tc_min || 0,
          humidity_percent: weatherData.rh_percent || 0,
          solar_radiation: weatherData.swdown || 0,
        } : null,
        activity: {
          last_spray_date: lastSpraying.activity_date,
          days_since: daysSince,
          plot: plot
        }
      })
    }

    const weatherData = await getTodayWeather(plot)

    if (!weatherData) {
      return NextResponse.json(
        { error: 'Weather data not available' },
        { status: 404 }
      )
    }

    // Extract DB fields (actual schema: tc_max, tc_min, rh_percent, swdown)
    const weather = weatherData as any
    const reasons: string[] = []
    let decision: 'ok' | 'caution' | 'wait' = 'ok'

    // Extract values from actual DB columns
    const tempMax = weather.tc_max || 0
    const tempMin = weather.tc_min || 0
    const humidity = weather.rh_percent || 0
    const solarRadiation = weather.swdown || 0

    // Check rain (mm)
    if (weather.rain_mm > 20) {
      decision = 'wait'
      reasons.push(`🌧️ ฝนคาดว่าจะตก ${weather.rain_mm}mm (เสี่ยงยาถูกชะล้าง)`)
    } else if (weather.rain_mm > 5) {
      if (decision === 'ok') decision = 'caution'
      reasons.push(`🌦️ ฝนคาดว่าจะตกเล็กน้อย ${weather.rain_mm}mm`)
    }

    // Check temperature (°C) - Changed from 'wait' to 'caution' to align with spray-engine.ts
    if (tempMax > 32) {
      if (decision !== 'wait') decision = 'caution'
      reasons.push(`🌡️ อุณหภูมิสูง ${tempMax}°C (ระวังระเหย)`)
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
        wind_speed_kmh: null, // Not available in TMD provider
        temp_max: tempMax,
        temp_min: tempMin,
        humidity_percent: humidity,
        solar_radiation: solarRadiation, // W/m² (surface downwelling shortwave radiation)
      },
      activity: lastSpraying ? {
        last_spray_date: lastSpraying.activity_date,
        days_since: daysSince,
        plot: plot
      } : null
    })
  } catch (error) {
    console.error('Spray decision API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spray decision' },
      { status: 500 }
    )
  }
}

/**
 * Calculate days since a given date
 */
function getDaysSince(dateString: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)

  const diffTime = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
