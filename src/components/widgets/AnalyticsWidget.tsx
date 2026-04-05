'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface CaseStudy {
  case_id?: string
  problem_type: string
  outcome: 'success' | 'partial' | 'failed' | 'pending'
  initial_action?: string
  observed_date: string
}

interface StatItem {
  problemType: string
  total: number
  success: number
  partial: number
  failed: number
  successRate: number
}

export function AnalyticsWidget() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // Get case studies from last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data, error } = await supabase
          .from('case_studies')
          .select('problem_type, outcome, observed_date')
          .neq('outcome', 'pending')
          .gte('observed_date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('observed_date', { ascending: false })

        if (error || !data) {
          return
        }

        // Group by problem type
        const grouped: Record<string, CaseStudy[]> = {}
        data.forEach(study => {
          if (!grouped[study.problem_type]) {
            grouped[study.problem_type] = []
          }
          grouped[study.problem_type].push(study)
        })

        // Calculate stats for each problem
        const statsData: StatItem[] = Object.entries(grouped).map(([problemType, studies]) => {
          const total = studies.length
          const success = studies.filter(s => s.outcome === 'success').length
          const partial = studies.filter(s => s.outcome === 'partial').length
          const failed = studies.filter(s => s.outcome === 'failed').length
          const successRate = total > 0 ? (success / total) * 100 : 0

          return {
            problemType,
            total,
            success,
            partial,
            failed,
            successRate
          }
        })

        setStats(statsData)
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-500">⏳ กำลังโหลด...</p>
      </div>
    )
  }

  if (stats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">📊 สถิติการรักษา (30 วัน)</h2>
        </div>
        <p className="text-gray-500 text-center py-4">ไม่มี case studies</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📊 สถิติการรักษา (30 วัน)</h2>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.problemType} className="border rounded-lg p-3">
            <h3 className="font-semibold mb-2">🎯 {stat.problemType}</h3>
            
            {/* Success Rate Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Success Rate</span>
                <span className="font-bold">{stat.successRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${stat.successRate}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-green-600">✅ {stat.success}</span>
              </div>
              <div>
                <span className="text-yellow-600">⚠️ {stat.partial}</span>
              </div>
              <div>
                <span className="text-red-600">❌ {stat.failed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
