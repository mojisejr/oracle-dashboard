// Rules constants - types not needed yet
// import type { WeatherForecast, OrchardActivity, SprayDecision } from './types'
// import { getDaysSince } from './utils'

/**
 * Spraying Rules from MEMORY.md
 * - Min 7-day interval
 * - No rain > 5mm
 * - Wind < 15 km/h
 * - Temp warning > 32°C
 */

const SPRAYING_RULES = {
  MIN_INTERVAL_DAYS: 7,
  MAX_rain_mm: 5,
  MAX_wind_speed: 15, // km/h
  temp_warningCelsius: 32,
}

