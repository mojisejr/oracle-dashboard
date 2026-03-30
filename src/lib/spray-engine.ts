import type { WeatherForecast, OrchardActivity, SprayDecision } from './types'
import { getDaysSince } from './utils'

/**
 * Spraying Rules from MEMORY.md:
 * - Min 7-day interval
 * - No rain > 5mm
 * - Wind < 15 km/h
 * - Temp warning > 32°C
 */

const SPRAYING_RULES = {
  MIN_INTERVAL_DAYS: 7,
  MAX_RAIN_MM: 5,
  MAX_WIND_SPEED: 15, // km/h
  WARNING_TEMP: 32, // °C
}

/**
 * Evaluate spray decision based on weather and last spray date
 */
export function evaluateSprayDecision(data: {
  lastSpray: OrchardActivity | null
  todayWeather: WeatherForecast
  futureWeather: WeatherForecast[]
}): SprayDecision {
  const reasons: string[] = []
  const recommendations: string[] = []

  // Rule 1: Check last spray interval (min 7 days)
  let daysSinceLastSpray = null
  if (data.lastSpray) {
    daysSinceLastSpray = getDaysSince(data.lastSpray.activity_date)
    if (daysSinceLastSpray < SPRAYING_RULES.MIN_INTERVAL_DAYS) {
      const daysToWait = SPRAYING_RULES.MIN_INTERVAL_DAYS - daysSinceLastSpray
      reasons.push(`พ่นล่าสุดเมื่อ ${daysSinceLastSpray} วันที่แล้ว ต้องรออีก ${daysToWait} วัน`)
      recommendations.push(`รอให้ครบ ${SPRAYING_RULES.MIN_INTERVAL_DAYS} วันหลังจากพ่นครั้งล่าสุด`)
    }
  }

  // Rule 2: Check today's rain
  const hasRain = data.todayWeather.rain_mm > SPRAYING_RULES.MAX_RAIN_MM
  if (hasRain) {
    reasons.push(`วันนี้มีฝน ${data.todayWeather.rain_mm.toFixed(1)} mm (เกิน ${SPRAYING_RULES.MAX_RAIN_MM} mm)`)
    recommendations.push('รอให้ฝนหยุดและสภาพอากาศแห้ง')
  }

  // Rule 3: Check wind speed (max 15 km/h)
  const hasHighWind = data.todayWeather.wind_speed > SPRAYING_RULES.MAX_WIND_SPEED
  if (hasHighWind) {
    reasons.push(`ลมแรง ${data.todayWeather.wind_speed.toFixed(1)} km/h (เกิน ${SPRAYING_RULES.MAX_WIND_SPEED} km/h)`)
    recommendations.push('เลือกช่วงเวลาที่ลมสงบ (เช้าหรือเย็น)')
  }

  // Rule 4: Check temperature (warning if > 32°C)
  const hasHighTemp = data.todayWeather.temp_max > SPRAYING_RULES.WARNING_TEMP
  if (hasHighTemp) {
    recommendations.push(`อุณหภูมิสูง ${data.todayWeather.temp_max.toFixed(1)}°C ควรพ่นช่วงเช้าหรือเย็น`)
  }

  // Rule 5: Check future rain (next 3 days)
  const willRainSoon = data.futureWeather.some(w => w.rain_mm > 10)
  if (willRainSoon) {
    recommendations.push('อีก 3 วันข้างหน้ามีฝน ควรเลือกช่วงที่ฝนน้อย')
  }

  // Determine status for interval check
  let intervalStatus: 'ok' | 'due_soon' | 'overdue' = 'ok'
  if (daysSinceLastSpray !== null) {
    if (daysSinceLastSpray < SPRAYING_RULES.MIN_INTERVAL_DAYS) {
      intervalStatus = 'due_soon'
    }
  } else {
    intervalStatus = 'overdue' // No spray recorded
  }

  // Can spray if no blocking reasons
  const canSpray = reasons.length === 0

  // Add positive recommendation if can spray
  if (canSpray && recommendations.length === 0) {
    recommendations.push('สภาพอากาศเหมาะสม พร้อมพ่นยาได้!')
  }

  return {
    canSpray,
    reasons,
    recommendations,
    weather_check: {
      rain: hasRain,
      wind: hasHighWind,
      temperature: hasHighTemp ? 'warning' : 'ok',
    },
    interval_check: {
      days_since_last: daysSinceLastSpray,
      min_interval: SPRAYING_RULES.MIN_INTERVAL_DAYS,
      status: intervalStatus,
    },
  }
}

/**
 * Find next dry day with good conditions
 */
export function findNextDryDay(futureWeather: WeatherForecast[]): string | null {
  const dryDay = futureWeather.find(w => 
    w.rain_mm <= SPRAYING_RULES.MAX_RAIN_MM && 
    w.wind_speed <= SPRAYING_RULES.MAX_WIND_SPEED
  )
  
  return dryDay?.forecast_date || null
}
