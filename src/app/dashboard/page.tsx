import { WateringWidget } from '@/components/widgets/WateringWidget'
import { SprayingWidget } from '@/components/widgets/SprayingWidget'
import { FertilizingWidget } from '@/components/widgets/FertilizingWidget'
import { SprayDecisionWidget } from '@/components/widgets/SprayDecisionWidget'
import { WeatherWidgetMinimal } from '@/components/widgets/WeatherWidgetMinimal'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary-900">
            🌿 Dashboard - Oracle Orchard
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            ติดตามกิจกรรมสวนแบบเรียลไทม์
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Watering Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            💧 การรดน้ำ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WateringWidget plot="suan_ban" />
          </div>
        </div>

        {/* Spraying Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🧪 การพ่นยา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SprayingWidget plot="suan_ban" />
          </div>
        </div>

        {/* Fertilizing Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🌱 การใส่ปุ๋ย
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FertilizingWidget plot="suan_ban" />
          </div>
        </div>

        {/* Spray Decision */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🤔 วันนี้พ่นยาได้ไหม?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SprayDecisionWidget />
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            🌤️ อากาศวันนี้
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <WeatherWidgetMinimal location="suan_ban" />
          </div>
        </div>
      </div>
    </div>
  )
}
