'use client'

import { useEffect, useState } from 'react'
import { formatDateThai } from '@/lib/utils'

interface SprayDecision {
  decision: 'ok' | 'caution' | 'wait'
  reasons: string[]
  weather: {
    date: string
    rain_mm: number
    wind_speed_kmh: number | null
    temp_max: number
    temp_min: number
    humidity_percent: number
    solar_radiation?: number
  }
}

export function SprayDecisionWidget() {
  const [data, setData] = useState<SprayDecision | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/spray-decision')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch spray decision')
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

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorCard message={error} />
  if (!data) return null

  const decisionConfig = {
    ok: {
      icon: '✅',
      label: 'พ่นยาได้',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
    },
    caution: {
      icon: '⚠️',
      label: 'ระวัง',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
    },
    wait: {
      icon: '🔴',
      label: 'รอก่อน',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
    },
  }

  const config = decisionConfig[data.decision]

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4 shadow-md`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          <span>วันนี้พ่นยาได้ไหม?</span>
        </h3>
        <div className={`px-3 py-1 rounded-full ${config.textColor} font-semibold text-sm`}>
          {config.icon} {config.label}
        </div>
      </div>

      {/* Decision Reasons */}
      <div className="space-y-2 mb-3">
        {data.reasons.map((reason, idx) => (
          <p key={idx} className="text-sm text-neutral-700">
            {reason}
          </p>
        ))}
      </div>

      {/* Weather Details */}
      <div className="mt-4 pt-3 border-t border-neutral-200">
        <p className="text-xs text-neutral-500 mb-2">
          📅 {formatDateThai(data.weather.date)}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
          <div>
            🌧️ ฝน: {data.weather.rain_mm}mm
          </div>
          <div>
            💨 ลม: {data.weather.wind_speed_kmh ? `${data.weather.wind_speed_kmh} km/h` : 'ไม่มีข้อมูล'}
          </div>
          <div>
            🌡️ อุณหภูมิ: {data.weather.temp_min}-{data.weather.temp_max}°C
          </div>
          <div>
            💧 ความชื้น: {data.weather.humidity_percent}%
          </div>
          <div>
            ☀️ แสง: {data.weather.solar_radiation ? `${Math.round(data.weather.solar_radiation)} W/m²` : 'ไม่มีข้อมูล'}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-700">❌ {message}</p>
    </div>
  )
}
