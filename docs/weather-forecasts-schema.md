# Weather Forecasts Table Schema

**Grounded**: 2026-04-01 16:30 GMT+7
**Source**: Direct query to production database (weather_forecasts)
**Method**: Queried sample records + inspected raw_json structure

---

## 📋 Table Structure

| Field | Type | Description | Sample Value |
|-------|------|-------------|--------------|
| `id` | uuid | Primary key | `"4cea9c37-..."` |
| `created_at` | timestamp | Record creation time | `"2026-02-07T05:57:32+00:00"` |
| `forecast_date` | date | Forecast date | `"2026-02-07"` |
| `location_id` | text | Plot identifier | `"suan-makham"` |
| `tc_max` | numeric | Temperature max (°C) | `39.29` |
| `tc_min` | numeric | Temperature min (°C) | `20.93` |
| `rain_mm` | numeric | Rainfall (mm) | `1.6` |
| `rh_percent` | numeric | Relative humidity (%) | `82.59` |
| **`swdown`** | **numeric** | **Solar radiation (W/m²)** | **`380.46`** |
| `raw_json` | jsonb | Nested forecast data from provider | `{ WeatherForecasts: [...] }` |
| `fetched_at` | timestamp | When data was fetched | `"2026-02-07T05:57:32+00:00"` |
| `forecast_run_at` | timestamp | When forecast was generated | `null` |
| `ingested_at` | timestamp | When data was ingested | `"2026-03-15T06:11:29+00:00"` |
| `provider` | text | Weather provider | `"tmd"` (Thai Meteorological Department) |
| `source_version` | text | Provider version | `null` |
| `ingest_key` | text | Ingestion identifier | `null` |

---

## 🌤️ Available Weather Data

### ✅ Temperature
- **Fields**: `tc_max`, `tc_min`
- **Unit**: Celsius (°C)
- **Usage**: Temperature thresholds for spraying decisions

### ✅ Rainfall
- **Field**: `rain_mm`
- **Unit**: Millimeters (mm)
- **Usage**: Rain risk assessment for spraying

### ✅ Humidity
- **Field**: `rh_percent`
- **Unit**: Percentage (%)
- **Usage**: Humidity-based decisions (high humidity = morning spray)

### ✅ Solar Radiation (LIGHT)
- **Field**: `swdown` (Surface Downwelling Shortwave Radiation)
- **Unit**: Watts per square meter (W/m²)
- **Typical Range**: 300-800 W/m² (sunny days: 700+, cloudy: 300-500)
- **Usage**: Light intensity for plant health monitoring
- **Notes**: This is the "แสง" (light) data the user mentioned!

### ❌ Wind Speed
- **Status**: **NOT AVAILABLE** in current schema
- **Reason**: Provider (TMD) doesn't include wind in this dataset
- **Impact**: Cannot check wind >15 km/h threshold for spray drift risk
- **Workaround**: Display "ไม่มีข้อมูล" in UI, add note in API documentation
- **Future**: Consider adding wind data from Open-Meteo or other provider

---

## 📦 Raw JSON Structure

The `raw_json` field contains nested forecast data from the provider:

```json
{
  "WeatherForecasts": [
    {
      "location": {
        "lat": 12.6635,
        "lon": 102.2146
      },
      "forecasts": [
        {
          "data": {
            "rh": 82.59,
            "rain": 1.6,
            "swdown": 380.46,
            "tc_max": 39.29,
            "tc_min": 20.93
          },
          "time": "2026-02-07T00:00:00+07:00"
        }
      ]
    }
  ]
}
```

**Note**: `raw_json` contains the same fields as the main table columns, just in nested structure.

---

## 🎯 Usage for Spray Decision

### Current Implementation
```typescript
// API: /api/spray-decision/route.ts
// Checks:
// - Rain >20mm → Wait (wash-off risk)
// - Temp >32°C → Wait (volatilization risk)
// - Temp >30°C → Caution
```

### Future Enhancement (swdown)
```typescript
// Can add solar radiation check:
// - swdown < 400 W/m² → Cloudy/Overcast (lower spray risk)
// - swdown > 700 W/m² → Very sunny (higher evaporation risk)
```

---

## 🔧 TypeScript Interface

**Current** (in `src/lib/types.ts`):
```typescript
export interface WeatherForecast {
  id: string
  location_id: string
  forecast_date: string
  temp_min: number
  temp_max: number
  rain_mm: number
  wind_speed: number  // ❌ WRONG - doesn't exist!
  humidity: number    // ❌ Should be rh_percent
  created_at: string
}
```

**Corrected** (should be):
```typescript
export interface WeatherForecast {
  id: string
  location_id: string
  forecast_date: string
  tc_min: number
  tc_max: number
  rain_mm: number
  rh_percent: number
  swdown: number
  provider?: string
  created_at: string
  fetched_at?: string
  ingested_at?: string
}
```

---

## 📝 Lessons Learned

### What I Got Wrong (Feature 4)
1. ❌ Assumed field names from TypeScript interface (`temp_max`, `humidity`, `wind_speed`)
2. ❌ Didn't check `swdown` field (solar radiation / light data)
3. ❌ Didn't verify actual DB schema before implementation

### What I Should Have Done
1. ✅ Query actual database FIRST (`check-weather-fixed.mjs`)
2. ✅ Inspect ALL available columns (not just the ones I thought existed)
3. ✅ Check `raw_json` for additional nested data
4. ✅ Ground TypeScript interface on actual schema

### Impact
- **Good news**: Found `swdown` (solar radiation) which can enhance decision logic
- **Bad news**: Confirmed NO wind data (but at least we know for sure now)
- **Fix needed**: Update TypeScript interface to match DB schema

---

## 🚀 Next Steps

### Immediate
- [ ] Update TypeScript interface in `src/lib/types.ts`
- [ ] Update `getTodayWeather()` query to select `swdown`
- [ ] Consider adding solar radiation to Spray Decision logic

### Future Enhancement
- [ ] Add wind data from Open-Meteo or other provider
- [ ] Enhance Spray Decision with light intensity (swdown)
- [ ] Create weather data quality monitoring (check for null/missing values)

---

**Status**: ✅ Schema Grounded (Confidence: 100%)
**Method**: Direct DB query + raw_json inspection
**Date**: 2026-04-01 16:30 GMT+7
**Author**: Oracle Ranger (o)
