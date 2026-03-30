import { describe, it, expect } from 'vitest'
import { getDaysSince, formatDateThai, formatPlotName } from '../src/lib/utils'

describe('Helper Functions', () => {
  describe('getDaysSince', () => {
    it('should return 0 for today', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      expect(getDaysSince(today.toISOString())).toBe(0)
    })

    it('should return 1 for yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(getDaysSince(yesterday.toISOString())).toBe(1)
    })

    it('should return 7 for a week ago', () => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      expect(getDaysSince(weekAgo.toISOString())).toBe(7)
    })
  })

  describe('formatDateThai', () => {
    it('should format date in Thai locale', () => {
      const date = '2026-03-30T06:30:00Z'
      const result = formatDateThai(date)
      expect(result).toContain('30')
      expect(result).toContain('มี.ค.')
    })
  })

  describe('formatPlotName', () => {
    it('should format plot names correctly', () => {
      expect(formatPlotName('suan_ban')).toBe('สวนบ้าน')
      expect(formatPlotName('suan_lang')).toBe('สวนล่าง')
      expect(formatPlotName('plant_shop')).toBe('แปลงพันธุ์ไม้')
      expect(formatPlotName('suan_makham')).toBe('สวนมะขาม')
    })

    it('should return original if plot name not found', () => {
      expect(formatPlotName('unknown_plot')).toBe('unknown_plot')
    })
  })
})
