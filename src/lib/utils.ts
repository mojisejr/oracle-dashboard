/**
 * Calculate days since a given date
 * @param date - Date string or @returns Number of days
 */
export function getDaysSince(date: string): number {
  const now = new Date()
  const target = new Date(date)
  const diffTime = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Format date to Thai locale
 * @param date - Date string | @returns Formatted date string
 */
export function formatDateThai(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format plot name for display
 * @param plotName - Plot name in database format | @returns Display name
 */
export function formatPlotName(plotName: string): string {
  const names: Record<string, string> = {
    suan_ban: 'สวนบ้าน',
    suan_lang: 'สวนล่าง',
    plant_shop: 'แปลงพันธุ์ไม้',
    suan_makham: 'สวนมะขาม',
  }
  return names[plotName] || plotName
}

