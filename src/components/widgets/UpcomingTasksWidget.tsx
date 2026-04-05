'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string
  event_type: string
  title: string
  event_date: string
  start_time?: string
  location?: string
  duration_minutes?: number
  priority: 'urgent' | 'important' | 'can_wait'
  source: 'manual' | 'derived'
}

export function UpcomingTasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTasks() {
      try {
        const today = new Date()
        const sevenDaysLater = new Date(today)
        sevenDaysLater.setDate(today.getDate() + 7)

        // Get manual tasks
        const { data: manualTasks } = await supabase
          .from('personal_schedule')
          .select('*')
          .gte('event_date', today.toISOString().split('T')[0])
          .lte('event_date', sevenDaysLater.toISOString().split('T')[0])
          .neq('schedule_status', 'cancelled')
          .order('event_date', { ascending: true })
          .order('priority', { ascending: false })
          .limit(10)

        // For now, just use manual tasks
        const allTasks: Task[] = (manualTasks || []).map(task => ({
          id: task.id,
          event_type: task.event_type || 'task',
          title: task.title,
          event_date: task.event_date,
          start_time: task.start_time,
          location: task.location,
          duration_minutes: task.duration_minutes,
          priority: task.priority || 'important',
          source: 'manual' as const,
        }))

        setTasks(allTasks)
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-500">⏳ กำลังโหลด...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">📅 กำหนดการ 7 วันข้างหน้า</h2>
        </div>
        <p className="text-gray-500 text-center py-4">ไม่มีกำหนดการ</p>
      </div>
    )
  }

  // Group tasks by date
  const tasksByDate = groupBy(tasks, task => task.event_date)
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📅 กำหนดการ 7 วันข้างหน้า</h2>
        <span className="text-sm text-gray-600">{tasks.length} รายการ</span>
      </div>

      <div className="space-y-4">
        {Object.entries(tasksByDate).map(([date, dateTasks]) => {
          const isToday = date === today
          const isTomorrow = date === tomorrow

          return (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">
                  {isToday && '🔴 วันนี้'}
                  {isTomorrow && '🟡 พรุ่งนี้'}
                  {!isToday && !isTomorrow && '⚪'}
                </span>
                <span className="text-sm text-gray-600">
                  {formatDate(date)}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-2 ml-4">
                {dateTasks.map((task, i) => (
                  <div key={i} className="border-l-2 border-gray-300 pl-3 py-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {task.start_time && (
                            <span className="text-sm text-gray-500">
                              {task.start_time}
                            </span>
                          )}
                          <span className="font-medium">{task.title}</span>
                        </div>
                        {task.location && (
                          <p className="text-sm text-gray-600">
                            📍 {task.location}
                          </p>
                        )}
                        {task.duration_minutes && (
                          <p className="text-sm text-gray-500">
                            {task.duration_minutes} นาที
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper functions
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${date.getDate()} ${months[date.getMonth()]}`
}
