/**
 * Utility functions for Oracle Dashboard
 * 
 * All date operations use Asia/Bangkok timezone by default
 * Re-exports from timezone.ts for backward compatibility
 */

// Re-export timezone-aware functions
export { getDaysSince, formatDateThai, getToday, formatDateShort } from './timezone'

// Keep formatPlotName here (not timezone-related)

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

