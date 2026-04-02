'use client'

import { useEffect, useState } from 'react'
import { getSprayDecision, getWateringDecision, getHeatStressWarning } from '@/lib/spray-engine'
import type { SprayStatus } from '@/lib/spray-engine'
import type { WeatherForecast } from '@/lib/types'

interface WeatherData {
  location: string
  forecast: WeatherForecast[]
}

export function WeatherWidgetMinimal() {
  const [data, setData] = useState<WeatherData | null>(null)
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
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
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

  if (!data || !data.forecast || data.forecast.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700">📊 ไม่มีข้อมูลอากาศ</p>
      </div>
    )
  }

  const today = data.forecast[0]
  const decision = getSprayDecision(today)
  const watering = getWateringDecision(today)
  const heatWarning = getHeatStressWarning(today.tc_max)

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg active:scale-98"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Collapsed View (2 lines) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{decision.icon}</span>
          <span className={`text-lg font-bold ${getStatusColor(decision.status)}`}>
            {decision.status === 'allowed' && 'พ่นยาได้'}
            {decision.status === 'wait' && 'งดพ่นยา'}
            {decision.status === 'caution' && 'รอดูสถานการณ์'}
          </span>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 flex gap-4">
        <span>{today.tc_max}°C</span>
        <span>{today.rain_mm}mm</span>
        <span>{today.rh_percent}%</span>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Decision Details */}
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">💡 คำแนะนำ</div>
            <p className="text-sm text-gray-700">{decision.reason}</p>
          </div>

          {/* Watering Advice */}
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">💧 การรดน้ำ</div>
            <p className="text-sm text-gray-700">
              {watering.icon} {watering.action}
            </p>
          </div>

          {/* Heat Warning */}
          {heatWarning && (
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">🌡️ คำเตือน</div>
              <p className="text-sm text-red-600">{heatWarning}</p>
            </div>
          )}

          {/* Weather Details */}
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">📊 รายละเอียด</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• อุณหภูมิ: {today.tc_min}-{today.tc_max}°C</div>
              <div>• ฝน: {today.rain_mm}mm {today.rain_mm === 0 && '(ไม่มีฝน)'}</div>
              <div>• ความชื้น: {today.rh_percent}%</div>
              <div>• แสงแดด: {today.swdown} W/m² {today.swdown > 400 && '(แรง)'}</div>
            </div>
          </div>

          {/* Tap hint */}
          <div className="text-xs text-gray-400 text-center mt-2">
            แตะเพื่อย่อ
          </div>
        </div>
      )}

      {/* Tap hint (collapsed) */}
      {!expanded && (
        <div className="text-xs text-gray-400 text-center mt-2">
          แตะเพื่อดูรายละเอียด
        </div>
      )}
    </div>
  )
}

/**
 * Get status color
 */
function getStatusColor(status: SprayStatus): string {
  switch (status) {
    case 'allowed':
      return 'text-green-600'
    case 'wait':
      return 'text-red-600'
    case 'caution':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}
