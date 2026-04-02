#!/usr/bin/env node

/**
 * Debug Script: Check weather_forecasts table
 * 
 * Purpose: Investigate why "วันนี้ shows 27 cards
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(config.SUPabaseUrl, config.SupabaseKey)

async function debug() {
  console.log('🔍 Debugging weather_forecasts table...\')

  // 1. Check total records
  const { data: allData, error } = await supabase
    .from('weather_forecasts')
    .select('*')

  if (error) {
    console.error('❌ Query error:', error)
    return
  }

  console.log(`📊 Total records: ${allData.length}\n`)

  // 2. Group by location
  const byLocation = {}
  allData.forEach(row => {
    if (!byLocation[row.location_id]) {
      byLocation[row.location_id] = []
    }
    byLocation[row.location_id].push(row)
  })

  console.log('📍 Locations:')
  Object.keys(byLocation).forEach(loc => {
    console.log(`  - ${loc}: ${byLocation[loc].length} records`)
  })
  console.log('')

  // 3. Check today's data
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = allData.filter(r => r.forecast_date === today)

  console.log(`📅 Today (${today}):`)
  console.log(`  Total: ${todayRecords.length} records`)

  if (todayRecords.length > 0) {
    console.log('\n  Sample records:')
    todayRecords.slice(0, 5).forEach(r => {
      console.log(`    - ${r.location_id}: ${r.forecast_date} (${r.tc_max}°C)`)
    })
  } else {
    console.log('  ⚠️ No data for today')
  }

  // 4. Check forecast_date range
  const dates = [...new Set(allData.map(r => r.forecast_date))]
  dates.sort()

  console.log(`📅 Date range: ${dates[0]} to ${dates[dates.length - 1]}`)
  console.log(`📅 Unique dates: ${dates.length}`)
  console.log('')

  // 5. Check for duplicates
  const duplicates = {}
  allData.forEach(row => {
    const key = `${row.location_id}_${row.forecast_date}`
    if (!duplicates[key]) {
      duplicates[key] = []
    }
    duplicates[key].push(row)
  })

  const dupKeys = Object.keys(duplicates).filter(k => duplicates[k].length > 1)
  if (dupKeys.length > 0) {
    console.log('⚠️  Duplicates found:')
    dupKeys.forEach(key => {
      console.log(`  - ${key}: ${duplicates[key].length} records`)
    })
  } else {
    console.log('✅ No duplicates found')
  }
}

debug()
