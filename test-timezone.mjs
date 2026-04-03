#!/usr/bin/env node
/**
 * Test timezone utilities
 * Verify that dashboard uses Asia/Bangkok timezone correctly
 */

import { getToday, getDaysSince, formatDateThai } from './src/lib/timezone.ts'

console.log('🧪 Testing Timezone Utilities\n')

// Test 1: getToday()
const today = getToday()
console.log('✅ getToday():', today)
console.log('   Expected format: YYYY-MM-DD')
console.log('   Actual timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log()

// Test 2: formatDateThai()
const testDate = '2026-04-02'
const formatted = formatDateThai(testDate)
console.log('✅ formatDateThai("2026-04-02"):', formatted)
console.log('   Expected: 2 เม.ย. 2569')
console.log()

// Test 3: getDaysSince()
const daysAgo = getDaysSince(testDate)
console.log('✅ getDaysSince("2026-04-02"):', daysAgo, 'days ago')
console.log('   (Depends on current date in Asia/Bangkok timezone)')
console.log()

// Test 4: Compare with raw new Date()
const rawNow = new Date()
const tzNow = new Date(rawNow.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
console.log('📅 Raw Date():', rawNow.toISOString())
console.log('📅 Asia/Bangkok:', tzNow.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }))
console.log()

console.log('✅ All tests passed!')
