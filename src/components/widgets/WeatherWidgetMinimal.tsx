'use client'

import { useEffect, useState } from 'react'
import type { WeatherForecast } from '@/lib/types'
import { getSprayDecision, getWateringDecision, getHeatStressWarning } from '@/lib/spray-engine'
import type { SprayDecisionResult } from '@/lib/spray-engine'

interface WeatherWidgetMinimalProps {
  location?: string // 'suan_ban' | 'suan_lang' | 'suan_makham'
}

export function WeatherWidgetMinimal({ location = 'suan_ban' }: WeatherWidgetMinimalProps) {
  const [weather, setWeather] = useState<WeatherForecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/weather/forecast')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weather forecast')
        return res.json()
      })
      .then(data => {
        // Take first forecast (today)
        if (data.forecast && data.forecast.length > 0) {
          setWeather(data.forecast[0])
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [location])

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">❌ {error}</p>
      </div>
    )
  }

  // No data state
  if (!weather) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600 text-sm">📊 ไม่พบข้อมูลอากาศ</p>
      </div>
    )
  }

  // Get spray decision
  const decision = getSprayDecision(weather)
  const wateringAdvice = getWateringDecision(weather)
  const heatWarning = getHeatStressWarning(weather.tc_max)

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg active:scale-98"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Collapsed View (2 lines) */}
      <HeroStatus decision={decision} />
      <KeyNumbers weather={weather} />

      {/* Expanded View */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Weather Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 รายละเอียด</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• อุณหภูมิ: {weather.tc_min}–{weather.tc_max}°C</div>
              <div>• ฝน: {weather.rain_mm}mm {weather.rain_mm === 0 ? '(ไม่มีฝน)' : ''}</div>
              <div>• ความชื้น: {weather.rh_percent}% {weather.rh_percent > 85 ? '(สูง)' : weather.rh_percent < 60 ? '(ต่ำ)' : '(ปกติ)'}</div>
              <div>• แสงแดด: {weather.swdown} W/m² {weather.swdown > 400 ? '(แรง)' : ''}</div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 คำแนะนำ</h4>
            <div className="space-y-1 text-sm">
              <div className={decision.status === 'allowed' ? 'text-green-700' : decision.status === 'wait' ? 'text-red-700' : 'text-yellow-700'}>
                • {decision.reason}
              </div>
              <div className="text-gray-600">• {wateringAdvice.icon} {wateringAdvice.action}</div>
              {heatWarning && <div className="text-red-700">• {heatWarning}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Tap hint (only when collapsed) */}
      {!expanded && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          แตะเพื่อดูรายละเอียด
        </div>
      )}
    </div>
  )
}

/**
 * Hero Status Component (1 line)
 * Shows: ✅ พ่นยาได้ / ❌ งดพ่นยา / 🟠 รอดูสถานการณ์
 */
function HeroStatus({ decision }: { decision: SprayDecisionResult }) {
  const statusText = {
    allowed: 'พ่นยาได้',
    wait: 'งดพ่นยา',
    caution: 'รอดูสถานการณ์',
  }

  const statusColor = {
    allowed: 'text-green-600',
    wait: 'text-red-600',
    caution: 'text-yellow-600',
  }

  return (
    <div className={`text-xl font-bold ${statusColor[decision.status]}`}>
      {decision.icon} {statusText[decision.status]}
    </div>
  )
}

/**
 * Key Numbers Component (1 line)
 * Shows: 36°C / 0mm / 65%
 */
function KeyNumbers({ weather }: { weather: WeatherForecast }) {
  return (
    <div className="text-sm text-gray-600 flex gap-4 mt-2">
      <span>{weather.tc_max}°C</span>
      <span>{weather.rain_mm}mm</span>
      <span>{weather.rh_percent}%</span>
    </div>
  )
}
