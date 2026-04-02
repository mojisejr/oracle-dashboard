'use client'

import { useEffect, useState } from 'react'

interface WeatherDay {
  date: string
  temp_max: number
  temp_min: number
  rain_mm: number
  humidity_percent: number
  solar_radiation: number | null
}

interface WeatherData {
  location: string
  forecast: WeatherDay[]
  provider: string
  generated_at: string
}

export function WeatherWidget() {
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
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  const { location, forecast } = data!

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🌦️ อากาศ 7 วัน</h3>
        <span className="text-sm text-gray-600">{location}</span>
      </div>

      {/* Today - Hero Card */}
      {forecast[0] && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-blue-900">วันนี้</div>
            <div className="text-sm text-gray-600">{formatShortDate(forecast[0].date)}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getWeatherIcon(forecast[0].rain_mm, forecast[0].solar_radiation)}</span>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900">{forecast[0].temp_max}°</div>
              <div className="text-sm text-gray-600">{forecast[0].temp_min}° / 💧 {forecast[0].rain_mm}mm</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {getWeatherAction(forecast[0].rain_mm)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next 6 Days - Compact List */}
      <div className="space-y-2">
        {forecast.slice(1).map((day, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getWeatherIcon(day.rain_mm, day.solar_radiation)}</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatShortDate(day.date)}
                </div>
                <div className="text-xs text-gray-600">
                  {day.temp_max}° / {day.temp_min}° / 💧 {day.rain_mm}mm
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-700">
              {getWeatherAction(day.rain_mm)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Format date to short Thai format
 * - Today: "วันนี้"
 * - Tomorrow: "พรุ่งนี้"
 * - Others: "3 เม.ย."
 */
function formatShortDate(dateStr: string): string {
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

/**
 * Get weather icon based on rain and solar radiation
 */
function getWeatherIcon(rainMm: number, solarRadiation: number | null): string {
  if (rainMm > 10) return '🌧️'
  if (rainMm > 5) return '🌦️'
  if (solarRadiation && solarRadiation > 400) return '☀️'
  return '⛅'
}

/**
 * Get actionable weather advice for farmers
 * - Rain > 20mm: ❌ งดพ่นยา
 * - Rain > 10mm: ⚠️ เลี่ยงพ่นยา
 * - Rain > 5mm: ✅ รดน้ำได้
 * - Otherwise: ✅ พ่นยาได้
 */
function getWeatherAction(rainMm: number): string {
  if (rainMm > 20) return '❌ งดพ่นยา'
  if (rainMm > 10) return '⚠️ เลี่ยงพ่นยา'
  if (rainMm > 5) return '✅ รดน้ำได้'
  return '✅ พ่นยาได้'
}
