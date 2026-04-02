import type { WeatherForecast } from './types'

/**
 * Weather Analysis - Data Processing Script
 * 
 * Purpose: Calculate trends, find peaks, identify patterns
 * Philosophy: Returns RAW data, agent generates insights
 * 
 * Rules (from IMPLEMENTATION_PHILOSOPHY.md):
 * - Script = Raw data provider (query, calculate)
 * - Agent = Reasoning layer (combine, reason, conclude)
 */

export interface WeatherTrends {
  temperature: {
    avgMax: number
    avgMin: number
    delta: number // +2 = hotter, -2 = cooler
    trend: 'hotter' | 'cooler' | 'stable'
  }
  rainfall: {
    total: number
    rainyDays: number
    dryDays: number
    trend: 'wetter' | 'drier' | 'stable'
  }
  humidity: {
    avg: number
    delta: number
    trend: 'more_humid' | 'drier' | 'stable'
  }
  light: {
    avg: number
    delta: number
    trend: 'stronger' | 'weaker' | 'stable'
  }
}

export interface WeatherPeaks {
  hottestDay: {
    date: string
    temp: number
  }
  coldestDay: {
    date: string
    temp: number
  }
  mostHumidDay: {
    date: string
    humidity: number
  }
  driestDay: {
    date: string
    humidity: number
  }
  brightestDay: {
    date: string
    light: number
  }
  rainiestDay: {
    date: string
    rain: number
  }
}

export interface WeatherRelationships {
  hotAndDry: boolean // avgTemp > 34 && avgHumidity < 65
  goodGrowth: boolean // avgHumidity 60-75 && avgLight > 500
  sunburnRisk: boolean // max(swdown) > 700
  droughtRisk: boolean // totalRain < 5 && avgTemp > 34
}

/**
 * Calculate 7-day weather trends
 */
export function calculateTrends(forecast: WeatherForecast[]): WeatherTrends {
  if (forecast.length === 0) {
    return {
      temperature: { avgMax: 0, avgMin: 0, delta: 0, trend: 'stable' },
      rainfall: { total: 0, rainyDays: 0, dryDays: 0, trend: 'stable' },
      humidity: { avg: 0, delta: 0, trend: 'stable' },
      light: { avg: 0, delta: 0, trend: 'stable' },
    }
  }

  // Temperature
  const avgMax = forecast.reduce((sum, d) => sum + d.tc_max, 0) / forecast.length
  const avgMin = forecast.reduce((sum, d) => sum + d.tc_min, 0) / forecast.length
  const tempDelta = forecast[forecast.length - 1].tc_max - forecast[0].tc_max
  const tempTrend = tempDelta > 1 ? 'hotter' : tempDelta < -1 ? 'cooler' : 'stable'

  // Rainfall
  const totalRain = forecast.reduce((sum, d) => sum + d.rain_mm, 0)
  const rainyDays = forecast.filter(d => d.rain_mm > 0).length
  const dryDays = forecast.filter(d => d.rain_mm === 0).length
  const rainTrend = rainyDays > 3 ? 'wetter' : dryDays > 5 ? 'drier' : 'stable'

  // Humidity
  const avgHumidity = forecast.reduce((sum, d) => sum + d.rh_percent, 0) / forecast.length
  const humidityDelta = forecast[forecast.length - 1].rh_percent - forecast[0].rh_percent
  const humidityTrend = humidityDelta > 5 ? 'more_humid' : humidityDelta < -5 ? 'drier' : 'stable'

  // Light (solar radiation)
  const avgLight = forecast.reduce((sum, d) => sum + d.swdown, 0) / forecast.length
  const lightDelta = forecast[forecast.length - 1].swdown - forecast[0].swdown
  const lightTrend = lightDelta > 50 ? 'stronger' : lightDelta < -50 ? 'weaker' : 'stable'

  return {
    temperature: { avgMax, avgMin, delta: tempDelta, trend: tempTrend },
    rainfall: { total: totalRain, rainyDays, dryDays, trend: rainTrend },
    humidity: { avg: avgHumidity, delta: humidityDelta, trend: humidityTrend },
    light: { avg: avgLight, delta: lightDelta, trend: lightTrend },
  }
}

/**
 * Find peak weather days
 */
export function findPeaks(forecast: WeatherForecast[]): WeatherPeaks {
  if (forecast.length === 0) {
    return {
      hottestDay: { date: '', temp: 0 },
      coldestDay: { date: '', temp: 0 },
      mostHumidDay: { date: '', humidity: 0 },
      driestDay: { date: '', humidity: 0 },
      brightestDay: { date: '', light: 0 },
      rainiestDay: { date: '', rain: 0 },
    }
  }

  // Sort by different metrics
  const byTemp = [...forecast].sort((a, b) => b.tc_max - a.tc_max)
  const byHumidity = [...forecast].sort((a, b) => b.rh_percent - a.rh_percent)
  const byLight = [...forecast].sort((a, b) => b.swdown - a.swdown)
  const byRain = [...forecast].sort((a, b) => b.rain_mm - a.rain_mm)

  return {
    hottestDay: { date: byTemp[0].forecast_date, temp: byTemp[0].tc_max },
    coldestDay: { date: byTemp[byTemp.length - 1].forecast_date, temp: byTemp[byTemp.length - 1].tc_min },
    mostHumidDay: { date: byHumidity[0].forecast_date, humidity: byHumidity[0].rh_percent },
    driestDay: { date: byHumidity[byHumidity.length - 1].forecast_date, humidity: byHumidity[byHumidity.length - 1].rh_percent },
    brightestDay: { date: byLight[0].forecast_date, light: byLight[0].swdown },
    rainiestDay: { date: byRain[0].forecast_date, rain: byRain[0].rain_mm },
  }
}

/**
 * Identify weather relationships (for agent to generate insights)
 */
export function identifyRelationships(
  trends: WeatherTrends,
  peaks: WeatherPeaks
): WeatherRelationships {
  return {
    // Hot + Dry = Fast evaporation
    hotAndDry: trends.temperature.avgMax > 34 && trends.humidity.avg < 65,

    // Moderate humidity + Good light = Good growth
    goodGrowth: trends.humidity.avg >= 60 && trends.humidity.avg <= 75 && trends.light.avg > 500,

    // Intense light = Sunburn risk
    sunburnRisk: peaks.brightestDay.light > 700,

    // No rain + Hot = Drought risk
    droughtRisk: trends.rainfall.total < 5 && trends.temperature.avgMax > 34,
  }
}

/**
 * Format date to short Thai format
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) return 'วันนี้'
  if (date.getTime() === tomorrow.getTime()) return 'พรุ่งนี้'

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short'
  })
}
