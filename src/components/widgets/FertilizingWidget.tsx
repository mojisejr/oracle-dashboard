'use client'

import { useEffect, useState } from 'react'
import { formatDateThai, formatPlotName } from '@/lib/utils'

interface ActivityData {
  id: string
  plot_name: string
  activity_type: string
  activity_date: string
  details: {
    target?: string
    purpose?: string
    fertilizers?: Array<{
      name: string
      amount: number
      unit: string
      type: string
    }>
    application_method?: string
    notes?: string
    [key: string]: any
  }
  days_ago: number
}

interface FertilizingWidgetProps {
  plot: string
}

export function FertilizingWidget({ plot }: FertilizingWidgetProps) {
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/activities/latest?plot=${plot}&type=fertilizing`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || 'Failed to fetch data')
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [plot])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorCard message={error} />
  if (!data) return <EmptyState plot={plot} />

  const status = getStatus(data.days_ago)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span>ใส่ปุ๋ยล่าสุด - {formatPlotName(data.plot_name)}</span>
        </h3>
        <StatusBadge status={status} />
      </div>
      <div className="space-y-2 text-sm text-neutral-700">
        <p className="flex items-center gap-2">
          <span>📅</span>
          <span>{formatDateThai(data.activity_date)} ({data.days_ago} วันที่แล้ว)</span>
        </p>
        {data.details.target && (
          <p className="flex items-center gap-2">
            <span>🎯</span>
            <span>เป้าหมาย: {data.details.target}</span>
          </p>
        )}
        {data.details.fertilizers && data.details.fertilizers.length > 0 && (
          <div className="flex items-start gap-2">
            <span>🌱</span>
            <div className="flex-1">
              <p className="font-medium">ปุ๋ย ({data.details.fertilizers.length} ชนิด):</p>
              <ul className="list-disc list-inside text-xs mt-1">
                {data.details.fertilizers.slice(0, 3).map((fert, idx) => (
                  <li key={idx}>{fert.name} ({fert.amount} {fert.unit})</li>
                ))}
                {data.details.fertilizers.length > 3 && (
                  <li className="text-gray-500">...และอีก {data.details.fertilizers.length - 3} ชนิด</li>
                )}
              </ul>
            </div>
          </div>
        )}
        {data.details.application_method && (
          <p className="flex items-center gap-2">
            <span>💧</span>
            <span>วิธีการ: {data.details.application_method}</span>
          </p>
        )}
        {data.details.notes && (
          <p className="flex items-start gap-2">
            <span>📝</span>
            <span className="flex-1">{data.details.notes}</span>
          </p>
        )}
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
      <p className="text-red-700 text-sm">❌ {message}</p>
    </div>
  )
}

function EmptyState({ plot }: { plot: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-gray-600 text-sm">ไม่พบข้อมูลการใส่ปุ๋ยของ {formatPlotName(plot)}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: 'ok' | 'due_soon' | 'overdue' }) {
  const config = {
    ok: { color: 'bg-green-100 text-green-700', text: '✅ ทันเวลา' },
    due_soon: { color: 'bg-yellow-100 text-yellow-700', text: '⚠️ ใกล้ถึงเวลา' },
    overdue: { color: 'bg-red-100 text-red-700', text: '🔴 เลยกำหนด' }
  }
  const { color, text } = config[status]
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{text}</span>
}

function getStatus(daysAgo: number): 'ok' | 'due_soon' | 'overdue' {
  if (daysAgo < 14) return 'ok'
  if (daysAgo < 30) return 'due_soon'
  return 'overdue'
}
