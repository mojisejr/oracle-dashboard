'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Case {
  id: string
  problem_type: string
  plot_id: string
  observed_date: string
  status: string
  ai_diagnosis?: string
  treatment?: string
  photos?: string[]
  similarCases?: CaseStudy[]
}

interface CaseStudy {
  case_id: string
  problem_type: string
  outcome: 'success' | 'partial' | 'failed' | 'pending'
  initial_action?: string
}

export function CaseTimelineWidget() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCases() {
      try {
        // Get active cases
        const { data: activeCases } = await supabase
          .from('cases')
          .select('*')
          .eq('status', 'active')
          .order('observed_date', { ascending: false })
          .limit(5)

        if (!activeCases || activeCases.length === 0) {
          setCases([])
          return
        }

        // For each case, get similar case studies
        const casesWithStudies = await Promise.all(
          activeCases.map(async (c) => {
            const { data: similarCases } = await supabase
              .from('case_studies')
              .select('*')
              .eq('problem_type', c.problem_type)
              .neq('outcome', 'pending')
              .order('observed_date', { ascending: false })
              .limit(3)

            return {
              ...c,
              similarCases: similarCases || [],
            }
          })
        )

        setCases(casesWithStudies)
      } catch (error) {
        console.error('Error loading cases:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-500">⏳ กำลังโหลด...</p>
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">📋 Case Timeline</h2>
        </div>
        <p className="text-gray-500 text-center py-4">ไม่มีเคสที่กำลังติดตาม</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📋 Case Timeline</h2>
        <span className="text-sm text-gray-600">{cases.length} เคส</span>
      </div>

      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="border rounded-lg p-3">
            {/* Active Case Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">🔴 {c.problem_type}</h3>
                <p className="text-sm text-gray-600">
                  {formatRelativeTime(c.observed_date)} • {c.plot_id}
                </p>
              </div>
            </div>

            {/* AI Diagnosis */}
            {c.ai_diagnosis && (
              <div className="mb-2 p-2 bg-blue-50 rounded text-sm">
                <strong>🤖 AI:</strong> {c.ai_diagnosis}
              </div>
            )}

            {/* Treatment */}
            {c.treatment && (
              <div className="mb-2 text-sm">
                <strong>💊 Treatment:</strong> {c.treatment}
              </div>
            )}

            {/* Similar Cases */}
            {c.similarCases && c.similarCases.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-2">
                  📚 Case Studies คล้ายกัน ({c.similarCases.length}):
                </p>
                <div className="space-y-2">
                  {c.similarCases.map((study) => (
                    <div key={study.case_id} className="text-sm">
                      <span className="font-medium">
                        {study.outcome === 'success' && '✅'}
                        {study.outcome === 'partial' && '⚠️'}
                        {study.outcome === 'failed' && '❌'}
                        {` ${study.case_id}`}
                      </span>
                      <span className="text-gray-600"> - {study.outcome}</span>
                      {study.initial_action && (
                        <p className="text-gray-500 text-xs mt-1">
                          {study.initial_action}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'วันนี้'
  if (diffDays === 1) return 'เมื่อวาน'
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`
  return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`
}
