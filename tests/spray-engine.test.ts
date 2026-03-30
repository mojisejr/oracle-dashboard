import { describe, it, expect } from 'vitest'
import { evaluateSprayDecision, findNextDryDay } from '../src/lib/spray-engine'
import type { WeatherForecast, OrchardActivity } from '../src/lib/types'

describe('Spray Decision Engine', () => {
  const mockWeather: WeatherForecast = {
    id: '1',
    location_id: 'suan-ban',
    forecast_date: '2026-03-30',
    temp_min: 24,
    temp_max: 30,
    rain_mm: 0,
    wind_speed: 8,
    humidity: 65,
    created_at: '2026-03-29T00:00:00Z',
  }

  const mockLastSpray: OrchardActivity = {
    id: '1',
    plot_name: 'suan_ban',
    activity_type: 'spraying',
    activity_date: '2026-03-25T07:00:00Z',
    details: { chemical: 'Metalaxyl', target: 'รากเน่า' },
    created_at: '2026-03-25T07:00:00Z',
  }

  describe('evaluateSprayDecision', () => {
    it('should allow spray when all conditions are good', () => {
      const decision = evaluateSprayDecision({
        lastSpray: { ...mockLastSpray, activity_date: '2026-03-20T07:00:00Z' }, // 10 days ago
        todayWeather: mockWeather,
        futureWeather: [],
      })

      expect(decision.canSpray).toBe(true)
      expect(decision.reasons).toHaveLength(0)
      expect(decision.recommendations).toContain('สภาพอากาศเหมาะสม พร้อมพ่นยาได้!')
      expect(decision.weather_check.rain).toBe(false)
      expect(decision.weather_check.wind).toBe(false)
      expect(decision.weather_check.temperature).toBe('ok')
      expect(decision.interval_check.status).toBe('ok')
    })

    it('should block spray if sprayed recently (within 7 days)', () => {
      const decision = evaluateSprayDecision({
        lastSpray: mockLastSpray, // 5 days ago
        todayWeather: mockWeather,
        futureWeather: [],
      })

      expect(decision.canSpray).toBe(false)
      expect(decision.reasons.length).toBeGreaterThan(0)
      expect(decision.reasons[0]).toContain('พ่นล่าสุดเมื่อ')
      expect(decision.interval_check.status).toBe('due_soon')
    })

    it('should block spray if rain > 5mm', () => {
      const rainyWeather = { ...mockWeather, rain_mm: 10 }
      const decision = evaluateSprayDecision({
        lastSpray: null,
        todayWeather: rainyWeather,
        futureWeather: [],
      })

      expect(decision.canSpray).toBe(false)
      expect(decision.reasons).toContainEqual(expect.stringContaining('มีฝน'))
      expect(decision.weather_check.rain).toBe(true)
    })

    it('should block spray if wind > 15 km/h', () => {
      const windyWeather = { ...mockWeather, wind_speed: 20 }
      const decision = evaluateSprayDecision({
        lastSpray: null,
        todayWeather: windyWeather,
        futureWeather: [],
      })

      expect(decision.canSpray).toBe(false)
      expect(decision.reasons).toContainEqual(expect.stringContaining('ลมแรง'))
      expect(decision.weather_check.wind).toBe(true)
    })

    it('should warn if temperature > 32°C but still allow spray', () => {
      const hotWeather = { ...mockWeather, temp_max: 35 }
      const decision = evaluateSprayDecision({
        lastSpray: { ...mockLastSpray, activity_date: '2026-03-20T07:00:00Z' }, // 10 days ago
        todayWeather: hotWeather,
        futureWeather: [],
      })

      // Can still spray (temperature is warning, not blocker)
      expect(decision.canSpray).toBe(true)
      expect(decision.weather_check.temperature).toBe('warning')
      expect(decision.recommendations).toContainEqual(expect.stringContaining('อุณหภูมิสูง'))
    })

    it('should return overdue status if no spray recorded', () => {
      const decision = evaluateSprayDecision({
        lastSpray: null,
        todayWeather: mockWeather,
        futureWeather: [],
      })

      expect(decision.canSpray).toBe(true)
      expect(decision.interval_check.days_since_last).toBe(null)
      expect(decision.interval_check.status).toBe('overdue')
    })

    it('should recommend waiting if future rain is expected', () => {
      const futureRain: WeatherForecast[] = [
        { ...mockWeather, forecast_date: '2026-03-31', rain_mm: 15 },
      ]
      
      const decision = evaluateSprayDecision({
        lastSpray: null,
        todayWeather: mockWeather,
        futureWeather: futureRain,
      })

      expect(decision.recommendations).toContainEqual(expect.stringContaining('ฝน'))
    })

    it('should handle multiple blocking conditions', () => {
      const badWeather = { ...mockWeather, rain_mm: 10, wind_speed: 20 }
      const decision = evaluateSprayDecision({
        lastSpray: mockLastSpray, // 5 days ago
        todayWeather: badWeather,
        futureWeather: [],
      })

      expect(decision.canSpray).toBe(false)
      expect(decision.reasons.length).toBeGreaterThan(1)
      expect(decision.weather_check.rain).toBe(true)
      expect(decision.weather_check.wind).toBe(true)
      expect(decision.interval_check.status).toBe('due_soon')
    })
  })

  describe('findNextDryDay', () => {
    const mockFutureWeather: WeatherForecast[] = [
      { ...mockWeather, forecast_date: '2026-03-31', rain_mm: 10, wind_speed: 5 },
      { ...mockWeather, forecast_date: '2026-04-01', rain_mm: 0, wind_speed: 8 },
      { ...mockWeather, forecast_date: '2026-04-02', rain_mm: 5, wind_speed: 20 },
      { ...mockWeather, forecast_date: '2026-04-03', rain_mm: 0, wind_speed: 10 },
    ]

    it('should find first day with no rain and low wind', () => {
      const dryDay = findNextDryDay(mockFutureWeather)
      expect(dryDay).toBe('2026-04-01')
    })

    it('should return null if no suitable day found', () => {
      const allBad = mockFutureWeather.map(w => ({ ...w, rain_mm: 10 }))
      const dryDay = findNextDryDay(allBad)
      expect(dryDay).toBe(null)
    })

    it('should accept day with rain <= 5mm and wind <= 15 km/h', () => {
      const acceptable = [
        { ...mockWeather, forecast_date: '2026-04-01', rain_mm: 5, wind_speed: 15 },
      ]
      const dryDay = findNextDryDay(acceptable)
      expect(dryDay).toBe('2026-04-01')
    })
  })
})
