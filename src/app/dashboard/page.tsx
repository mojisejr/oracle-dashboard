'use client'

import { useState } from 'react'
import { WateringWidget } from '@/components/widgets/WateringWidget'
import { SprayingWidget } from '@/components/widgets/SprayingWidget'
import { FertilizingWidget } from '@/components/widgets/FertilizingWidget'
import { SprayDecisionWidget } from '@/components/widgets/SprayDecisionWidget'
import { WeatherReportWidget } from '@/components/widgets/WeatherReportWidget'
import { AlertCardsWidget } from '@/components/widgets/AlertCardsWidget'
import { UpcomingTasksWidget } from '@/components/widgets/UpcomingTasksWidget'
import { CaseTimelineWidget } from '@/components/widgets/CaseTimelineWidget'
import { PharmacyWidget } from '@/components/widgets/PharmacyWidget'
import { ActivityHistoryWidget } from '@/components/widgets/ActivityHistoryWidget'
import { AnalyticsWidget } from '@/components/widgets/AnalyticsWidget'

const PLOTS = [
  { id: 'suan_ban', name: 'สวนบ้าน' },
  { id: 'suan_lang', name: 'สวนล่าง' },
  { id: 'plant_shop', name: 'แปลงพันธุ์ไม้' },
  { id: 'suan_makham', name: 'สวนมะขาม' },
] as const

export default function DashboardPage() {
  const [selectedPlot, setSelectedPlot] = useState('suan_ban')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">
                🌿 Dashboard - Oracle Orchard
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                ติดตามกิจกรรมสวนแบบเรียลไทม์
              </p>
            </div>

            {/* Plot Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="plot-selector" className="text-sm font-medium text-neutral-700">
                เลือกแปลง:
              </label>
              <select
                id="plot-selector"
                value={selectedPlot}
                onChange={(e) => setSelectedPlot(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PLOTS.map(plot => (
                  <option key={plot.id} value={plot.id}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* NEW: Alert Cards (Sticky) */}
        <div className="sticky top-0 z-10 bg-white shadow-md mb-4">
          <AlertCardsWidget />
        </div>

        {/* NEW: Upcoming Tasks */}
        <div className="mb-6">
          <UpcomingTasksWidget />
        </div>

        {/* NEW: Case Timeline */}
        <div className="mb-6">
          <CaseTimelineWidget />
        </div>

        {/* Separator */}
        <hr className="my-8 border-t-2 border-gray-200" />
        <div className="text-center">
          <span className="text-sm font-medium text-gray-500">
            ━━━━ Current Activities ━━━━
          </span>
        </div>

        {/* Watering Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            💧 การรดน้ำ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WateringWidget plot={selectedPlot} />
          </div>
        </div>

        {/* Spraying Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🧪 การพ่นยา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SprayingWidget plot={selectedPlot} />
          </div>
        </div>

        {/* Fertilizing Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🌱 การใส่ปุ๋ย
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FertilizingWidget plot={selectedPlot} />
          </div>
        </div>

        {/* Spray Decision */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🤔 วันนี้พ่นยาได้ไหม?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SprayDecisionWidget plot={selectedPlot} />
          </div>
        </div>

        {/* Weather Report */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🌤️ สรุปอากาศ 7 วัน
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <WeatherReportWidget location={selectedPlot} />
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-t-2 border-gray-200" />
        <div className="text-center">
          <span className="text-sm font-medium text-gray-500">
            ━━━━ Intelligence & History ━━━
          </span>
        </div>

        {/* NEW: Pharmacy */}
        <div className="mb-6">
          <PharmacyWidget />
        </div>

        {/* NEW: Activity History */}
        <div className="mb-6">
          <ActivityHistoryWidget />
        </div>

        {/* NEW: Analytics */}
        <div className="mb-6">
          <AnalyticsWidget />
        </div>
      </div>
    </div>
  )
}
