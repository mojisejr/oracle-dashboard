/**
 * Timezone utilities for Oracle Dashboard
 * 
 * Ensures all date operations use Asia/Bangkok timezone
 * Mirrors logic from skills/_shared-orchard/scripts/lib/timezone.js
 */

export const DEFAULT_TIMEZONE = 'Asia/Bangkok'

/**
 * Validate timezone string
 */
export function isValidTimezone(timezone: string): boolean {
  if (!timezone || typeof timezone !== 'string') return false
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

/**
 * Get today's date (YYYY-MM-DD) in timezone
 */
export function getToday(timezone: string = DEFAULT_TIMEZONE): string {
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }
  return new Date().toLocaleDateString('en-CA', { timeZone: timezone })
}

/**
 * Get current date/time in timezone
 */
export function getNow(timezone: string = DEFAULT_TIMEZONE): Date {
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }
  const now = new Date()
  const tzStr = now.toLocaleString('en-US', { timeZone: timezone })
  return new Date(tzStr)
}

/**
 * Calculate days since a given date (timezone-aware)
 */
export function getDaysSince(date: string, timezone: string = DEFAULT_TIMEZONE): number {
  const now = getNow(timezone)
  const target = new Date(date)
  const diffTime = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Format date to Thai locale (timezone-aware)
 */
export function formatDateThai(date: string, timezone: string = DEFAULT_TIMEZONE): string {
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }
  const d = new Date(date)
  return d.toLocaleDateString('th-TH', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date to short format (DD/MM)
 */
export function formatDateShort(date: string, timezone: string = DEFAULT_TIMEZONE): string {
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }
  const d = new Date(date)
  return d.toLocaleDateString('th-TH', {
    timeZone: timezone,
    day: 'numeric',
    month: 'short',
  })
}
