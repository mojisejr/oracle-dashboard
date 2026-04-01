'use client'

import { useEffect, useState } from 'react'
import { formatDateThai } from '@/lib/utils'

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">🌦️ Weather Forecast</h3>
        <span className="text-sm text-gray-600">{location}</span>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {forecast.map((day, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-3">
            {/* Date */}
            <div className="text-center mb-2">
              <div className="text-sm font-semibold text-gray-900">
                {formatDateThai(day.date)}
              </div>
            </div>

            {/* Temperature */}
            <div className="mb-1">
              <div className="flex items-center gap-1">
                <span className="text-2xl">🌡️</span>
                <span className="text-sm">
                  {day.temp_max}° / {day.temp_min}°
                </span>
              </div>
            </div>

            {/* Rain */}
            <div className="mb-1">
              <div className="flex items-center gap-1">
                <span className="text-2xl">💧</span>
                <span className="text-sm">
                  {day.rain_mm}mm
                </span>
              </div>
            </div>

            {/* Humidity */}
            <div className="mb-1">
              <div className="flex items-center gap-1">
                <span className="text-2xl">💨</span>
                <span className="text-sm">
                  {day.humidity_percent}%
                </span>
              </div>
            </div>

            {/* Solar Radiation */}
            {day.solar_radiation && (
              <div className="mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-2xl">☀️</span>
                  <span className="text-sm">
                    {day.solar_radiation} W/m²
                  </span>
                </div>
              </div>
            )}

            {/* Weather Icon */}
            <div className="text-center">
              {getWeatherIcon(day.rain_mm, day.solar_radiation)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getWeatherIcon(rainMm: number, solarRadiation: number | null): string {
  if (rainMm > 10) return '🌧️'
  if (rainMm > 5) return '🌦️'
  if (solarRadiation && solarRadiation > 400) return '☀️'
  return '⛅'
}
