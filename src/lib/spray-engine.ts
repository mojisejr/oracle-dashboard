import type { WeatherForecast } from './types'

/**
 * Spraying Rules from MEMORY.md
 * - Min 7-day interval
 * - No rain > 20mm (wash-off risk)
 * - Temp warning > 32°C (volatilization risk)
 * - Rain <= 5mm AND temp <= 32°C → OK to spray
 */

const SPRAYING_RULES = {
  MIN_INTERVAL_DAYS: 7,
  MAX_RAIN_MM: 20, // mm (wash-off risk threshold)
  TEMP_WARNING_CELSIUS: 32, // °C (volatilization risk)
  RAIN_OK_THRESHOLD: 5, // mm (safe to spray)
}

/**
 * Spray Decision Status
 * - allowed: ✅ พ่นยาได้
 * - wait: ❌ งดพ่นยา (rain too heavy)
 * - caution: 🟠 รอดูสถานการณ์ (temp too hot / moderate rain)
 */
export type SprayStatus = 'allowed' | 'wait' | 'caution'

export interface SprayDecisionResult {
  status: SprayStatus
  reason: string
  icon: string
}

/**
 * Get spray decision based on weather forecast
 * 
 * Rules:
 * - rain > 20mm → wait (งดพ่นยา: ฝนตกหนัก)
 * - temp > 32°C → caution (ระวังความร้อน)
 * - rain <= 5mm AND temp <= 32°C → allowed (พ่นยาได้)
 * - Otherwise → caution (รอดูสถานการณ์)
 */
export function getSprayDecision(weather: WeatherForecast): SprayDecisionResult {
  const { rain_mm, tc_max } = weather

  // Rule 1: Heavy rain → wait
  if (rain_mm > SPRAYING_RULES.MAX_RAIN_MM) {
    return {
      status: 'wait',
      reason: `งดพ่นยา: ฝน ${rain_mm}mm (เสี่ยงถูกชะล้าง)`,
      icon: '🌧️',
    }
  }

  // Rule 2: Hot temperature → caution
  if (tc_max > SPRAYING_RULES.TEMP_WARNING_CELSIUS) {
    return {
      status: 'caution',
      reason: `ระวังความร้อน: ${tc_max}°C (เลี่ยงเวลา 11-15 โมง)`,
      icon: '🌡️',
    }
  }

  // Rule 3: Light rain + cool temp → allowed
  if (rain_mm <= SPRAYING_RULES.RAIN_OK_THRESHOLD && tc_max <= SPRAYING_RULES.TEMP_WARNING_CELSIUS) {
    return {
      status: 'allowed',
      reason: `พ่นยาได้: ไม่มีฝน + อุณหภูมิเหมาะสม`,
      icon: '✅',
    }
  }

  // Default: caution (moderate rain)
  return {
    status: 'caution',
    reason: `รอดูสถานการณ์: ฝน ${rain_mm}mm (เลี่ยงได้เลี่ยง)`,
    icon: '🟠',
  }
}

/**
 * Get watering decision based on weather
 * 
 * Rules:
 * - rain > 10mm → nature watered (ไม่ต้องรดน้ำ)
 * - humidity > 85% → high humidity (รดน้ำน้อยลง)
 * - humidity < 60% → dry (รดน้ำเพิ่ม)
 */
export function getWateringDecision(weather: WeatherForecast): {
  action: string
  icon: string
} {
  const { rain_mm, rh_percent } = weather

  if (rain_mm > 10) {
    return {
      action: `ฝนช่วยรดน้ำแล้ว: ${rain_mm}mm`,
      icon: '🌧️',
    }
  }

  if (rh_percent > 85) {
    return {
      action: `ความชื้นสูง: ${rh_percent}% (รดน้ำน้อยลง)`,
      icon: '💧',
    }
  }

  if (rh_percent < 60) {
    return {
      action: `อากาศแห้ง: ${rh_percent}% (รดน้ำเพิ่ม)`,
      icon: '🏜️',
    }
  }

  return {
    action: `ความชื้นปกติ: ${rh_percent}%`,
    icon: '💧',
  }
}

/**
 * Get heat stress warning
 */
export function getHeatStressWarning(temp_max: number): string | null {
  if (temp_max > 35) {
    return `🔴 เสี่ยงความร้อน: ${temp_max}°C (รดน้ำเยอะๆ)`
  }
  return null
}
