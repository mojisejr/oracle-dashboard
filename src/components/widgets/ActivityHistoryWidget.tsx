'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ActivityLog {
  id: string
  activity_type: string
  plot_name: string
  details: any
  notes?: string
  created_at: string
}

export function ActivityHistoryWidget() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true)

        // Calculate date range (30 days ago)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(20)

        if (!error && data) {
          setActivities(data)
        }
      } catch (error) {
        console.error('Error loading activities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  const filteredActivities = activities.filter(activity => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    const typeMatch = activity.activity_type.toLowerCase().includes(searchLower)
    const plotMatch = activity.plot_name.toLowerCase().includes(searchLower)
    const notesMatch = activity.notes?.toLowerCase().includes(searchLower)
    
    return typeMatch || plotMatch || notesMatch
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watering': return '💧'
      case 'spraying': return '🧪'
      case 'fertilizing': return '🌱'
      case 'monitoring': return '👀'
      case 'pruning': return '✂️'
      default: return '📝'
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'watering': return 'รดน้ำ'
      case 'spraying': return 'พ่นยา'
      case 'fertilizing': return 'ใส่ปุ๋ย'
      case 'monitoring': return 'ตรวจสวน'
      case 'pruning': return 'ตัดแต่ง'
      default: return 'อื่นๆ'
    }
  }

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'วันนี้'
    if (diffDays === 1) return 'เมื่อวาน'
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`
    return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-500">⏳ กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📜 Activity History</h2>
        <span className="text-sm text-gray-600">{filteredActivities.length} รายการ</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 ค้นหา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      {/* Activity Cards */}
      {filteredActivities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">ไม่มีกิจกรรม</p>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity, i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    {getActivityIcon(activity.activity_type)} {getActivityLabel(activity.activity_type)} • {activity.plot_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(activity.created_at)}
                  </p>
                </div>
              </div>
              
              {/* Notes */}
              {activity.notes && (
                <p className="text-sm text-gray-600 mt-2">
                  📝 {activity.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
