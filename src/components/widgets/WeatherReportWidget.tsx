'use client'

import { useEffect, useState } from 'react'
import { calculateTrends, findPeaks, identifyRelationships, formatShortDate } from '@/lib/weather-analysis'
import type { WeatherForecast } from '@/lib/types'
import type { WeatherTrends, WeatherPeaks, WeatherRelationships } from '@/lib/weather-analysis'

interface WeatherData {
  location: string
  forecast: WeatherForecast[]
}

export function WeatherReportWidget() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/weather/forecast')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weather forecast')
        return res.json()
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">❌ {error}</p>
      </div>
    )
  }

  if (!data || !data.forecast || data.forecast.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700">📊 ไม่มีข้อมูลอากาศ</p>
      </div>
    )
  }

  // Calculate analysis (script returns raw data)
  const trends = calculateTrends(data.forecast)
  const peaks = findPeaks(data.forecast)
  const relationships = identifyRelationships(trends, peaks)

  // Agent generates insights (reasoning layer)
  const insights = generateInsights(trends, peaks, relationships)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🌤️ สรุปอากาศ 7 วัน</h3>
        <span className="text-sm text-gray-600">{data.location}</span>
      </div>

      {/* Trends Summary */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-900">📊 แนวโน้ม</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span>🌡️ อุณหภูมิ:</span>
            <span className={getTrendColor(trends.temperature.trend)}>
              {trends.temperature.avgMin.toFixed(0)}-{trends.temperature.avgMax.toFixed(0)}°C
              {trends.temperature.delta > 0 && ` → ร้อนขึ้น ${trends.temperature.delta.toFixed(0)}°C`}
              {trends.temperature.delta < 0 && ` → เย็นลง ${Math.abs(trends.temperature.delta).toFixed(0)}°C`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌧️ ฝน:</span>
            <span className={getTrendColor(trends.rainfall.trend)}>
              {trends.rainfall.total.toFixed(0)}mm
              {trends.rainfall.dryDays === 7 && ' (ไม่มีฝน 7 วัน)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>💧 ความชื้น:</span>
            <span className={getTrendColor(trends.humidity.trend)}>
              {trends.humidity.avg.toFixed(0)}%
              {trends.humidity.delta > 0 && ' → ชื้นขึ้น'}
              {trends.humidity.delta < 0 && ' → แห้งลง'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>☀️ แสง:</span>
            <span className={getTrendColor(trends.light.trend)}>
              {trends.light.avg.toFixed(0)} W/m²
              {trends.light.delta > 0 && ' → แรงขึ้น'}
              {trends.light.delta < 0 && ' → อ่อนลง'}
            </span>
          </div>
        </div>
      </div>

      {/* Peak Indicators */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-900">📈 จุดสังเกต</div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>• ชื้นสุด: {formatShortDate(peaks.mostHumidDay.date)} ({peaks.mostHumidDay.humidity.toFixed(0)}%)</div>
          <div>• แสงเยอะสุด: {formatShortDate(peaks.brightestDay.date)} ({peaks.brightestDay.light.toFixed(0)} W/m²)</div>
          <div>• ร้อนสุด: {formatShortDate(peaks.hottestDay.date)} ({peaks.hottestDay.temp.toFixed(0)}°C)</div>
          {peaks.rainiestDay.rain > 0 && (
            <div>• ฝนเยอะสุด: {formatShortDate(peaks.rainiestDay.date)} ({peaks.rainiestDay.rain.toFixed(0)}mm)</div>
          )}
        </div>
      </div>

      {/* Relationship Insights (Agent Reasoning) */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-900">💡 ความสัมพันธ์</div>
        <div className="space-y-1 text-sm text-gray-700">
          {insights.map((insight, idx) => (
            <div key={idx}>• {insight}</div>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-900">📅 รายวัน (← scroll →)</div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {data.forecast.map((day, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-24 bg-gray-50 rounded-lg p-3 text-center"
              >
                <div className="text-xs font-semibold text-gray-900 mb-1">
                  {formatShortDate(day.forecast_date)}
                </div>
                <div className="text-2xl mb-1">
                  {getWeatherIcon(day.rain_mm, day.swdown)}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {day.tc_max.toFixed(0)}°
                </div>
                <div className="text-xs text-gray-600">
                  {day.rain_mm.toFixed(0)}mm
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Agent Reasoning: Generate insights from relationships
 *
 * Philosophy: Script provides raw data, agent generates meaning
 */
function generateInsights(
  _trends: WeatherTrends,
  _peaks: WeatherPeaks,
  relationships: WeatherRelationships
): string[] {
  const insights: string[] = []

  // Hot + Dry relationship
  if (relationships.hotAndDry) {
    insights.push('ร้อนมาก + แห้ง → รดน้ำเพิ่ม (ต้นไม้กายใจมาก)')
  }

  // Good growth conditions
  if (relationships.goodGrowth) {
    insights.push('ชื้นปานกลาง + แดดพอ → โตดี (สภาพเหมาะสม)')
  }

  // Sunburn risk
  if (relationships.sunburnRisk) {
    insights.push('แสงแรง → เสี่ยวไหม้ → พรางแสง (ช่วงเที่ยง)')
  }

  // Drought risk
  if (relationships.droughtRisk) {
    insights.push('ไม่มีฝน + ร้อน → เสี่ยงแล้ง → ติดตามใกล้ชิด')
  }

  // Default if no special conditions
  if (insights.length === 0) {
    insights.push('สภาพอากาศปกติ → ดำเนินการตามปกติ')
  }

  return insights
}

/**
 * Get trend color
 */
function getTrendColor(trend: string): string {
  switch (trend) {
    case 'hotter':
    case 'drier':
      return 'text-red-600'
    case 'cooler':
    case 'wetter':
      return 'text-blue-600'
    case 'stronger':
      return 'text-yellow-600'
    case 'more_humid':
      return 'text-cyan-600'
    default:
      return 'text-gray-700'
  }
}

/**
 * Get weather icon based on rain and light
 */
function getWeatherIcon(rainMm: number, solarRadiation: number): string {
  if (rainMm > 10) return '🌧️'
  if (rainMm > 5) return '🌦️'
  if (solarRadiation > 400) return '☀️'
  return '⛅'
}
