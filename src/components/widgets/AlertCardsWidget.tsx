'use client'

import { useEffect, useState } from 'react'
import { getTodayWeather, getActiveCases } from '@/lib/queries'

interface Alert {
  type: 'vpd_high' | 'spray_window' | 'disease_outbreak' | 'task_due' | 'case_follow_up'
  priority: 'critical' | 'warning' | 'info'
  title: string
  description: string
  link?: { label: string; href: string }
}

export function AlertCardsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const loadedAlerts: Alert[] = []

        // 1. VPD Alert
        const weather = await getTodayWeather('suan_ban')
        if (weather && weather.tc_max && weather.rh_percent) {
          const vpd = calculateVPD(weather.tc_max, weather.rh_percent)
          if (vpd > 1.6) {
            loadedAlerts.push({
              type: 'vpd_high',
              priority: 'critical',
              title: `VPD สูงเกินไป (${vpd.toFixed(2)} kPa)`,
              description: 'รดน้ำด่วน!',
              link: { label: 'ดูรายละเอียด', href: '#watering' },
            })
          }
        }

        // 2. Spray Window Alert
        // TODO: Add spray decision logic
        // const sprayDecision = await getSprayDecision('suan_ban')

        // 3. Disease Outbreak Alert
        const cases = await getActiveCases()
        const caseGroups = groupBy(cases, (item) => item.problem_type)
        for (const [problemType, problemCases] of Object.entries(caseGroups)) {
          if (problemCases.length >= 3) {
            loadedAlerts.push({
              type: 'disease_outbreak',
              priority: 'warning',
              title: `โรคระบาด (${problemCases.length} เคสใน 7 วัน)`,
              description: problemType,
              link: { label: 'ดู Case Studies', href: '#case-timeline' },
            })
          }
        }

        setAlerts(loadedAlerts)
      } catch (error) {
        console.error('Error loading alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [])

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <p className="text-sm text-gray-500">⏳ กำลังโหลด alerts...</p>
      </div>
    )
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-red-700">
          🚨 Alerts ({alerts.length})
        </h2>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <AlertCard key={i} alert={alert} />
        ))}
      </div>
    </div>
  )
}

function AlertCard({ alert }: { alert: Alert }) {
  const priorityColors = {
    critical: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  const priorityIcons = {
    critical: '🔴',
    warning: '🟡',
    info: '🔵',
  }

  return (
    <div className={`p-3 rounded-lg border ${priorityColors[alert.priority]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">
            {priorityIcons[alert.priority]} {alert.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
        </div>
        {alert.link && (
          <a
            href={alert.link.href}
            className="text-blue-600 text-sm font-medium hover:underline ml-2"
          >
            {alert.link.label}
          </a>
        )}
      </div>
    </div>
  )
}

// Helper functions
function calculateVPD(temp: number, humidity: number): number {
  const saturationVP = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3))
  const actualVP = saturationVP * (humidity / 100)
  return saturationVP - actualVP
}

function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = key(item)
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}
