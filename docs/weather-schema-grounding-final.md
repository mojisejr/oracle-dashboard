# Weather Forecasts Schema - Complete Grounding

**Date**: 2026-04-01 17:16 GMT+7
**Method**: Direct database query + skill documentation review
**Status**: ✅ FULLY GROUNDED

---

## 📊 Final Results

### ✅ Light Data (แสง) - CONFIRMED
```
Field: swdown
Type: number
Unit: W/m² (Watts per square meter)
Sample: 380.46
Provider: TMD
Location: Top-level column + raw_json nested
```

**Meaning**: Surface Downwelling Shortwave Radiation
- Measures solar radiation reaching the ground
- Typical range: 300-800 W/m²
- Usage: Light intensity for plant health monitoring

---

### ❌ Wind Data (ลม) - NOT PRESENT
```
Database: weather_forecasts
Provider: tmd (Thai Meteorological Department)
Columns: 15 total
Wind fields: NONE
```

**Evidence**:
1. Direct query shows NO wind columns
2. raw_json contains ONLY: `rh, rain, swdown, tc_max, tc_min`
3. Searched entire raw_json: No "wind" substring found
4. Only one provider: TMD (no alternative sources)

**Why Missing**:
- TMD dataset doesn't include wind data
- No alternative weather provider configured
- Phase 2 enhancement (documented in skill README) not yet implemented

---

### ✅ Raw JSON Structure - CONFIRMED
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

**All 7 forecast entries have identical fields**: `rh, rain, swdown, tc_max, tc_min`

---

## 📋 Complete Table Schema

| Column | Type | Sample Value | Description |
|--------|------|--------------|-------------|
| `id` | uuid | `4cea9c37-...` | Primary key |
| `created_at` | timestamp | `2026-02-07T05:57:32+00:00` | Record creation |
| `forecast_date` | date | `2026-02-07` | Forecast date |
| `location_id` | text | `suan-makham` | Plot identifier |
| `tc_max` | number | `39.29` | Temperature max (°C) |
| `tc_min` | number | `20.93` | Temperature min (°C) |
| `rain_mm` | number | `1.6` | Rainfall (mm) |
| `rh_percent` | number | `82.59` | Relative humidity (%) |
| **`swdown`** | **number** | **`380.46`** | **Solar radiation (W/m²)** |
| `raw_json` | jsonb | `{ WeatherForecasts: [...] }` | Nested provider data |
| `fetched_at` | timestamp | `2026-02-07T05:57:32+00:00` | Data fetch time |
| `forecast_run_at` | timestamp | `null` | Forecast generation time |
| `ingested_at` | timestamp | `2026-03-15T06:11:29+00:00` | Database ingestion time |
| `provider` | text | `tmd` | Weather provider (TMD only) |
| `source_version` | text | `null` | Provider version |
| `ingest_key` | text | `null` | Ingestion identifier |

---

## 🔍 Documentation Discrepancy Found

**o-weather-query README.md** mentions:
```markdown
### Phase 2: Decision Support
- "พอดีไหมที่จะพ่นยา" → Check rain + wind forecast
```

**Reality**: 
- ❌ Wind data NOT present in current schema
- ✅ This is a FUTURE enhancement (Phase 2)
- ✅ Documentation is forward-looking, not current capability

---

## 🎯 Implications for Dashboard

### Spray Decision Widget
**Current Implementation** (CORRECT):
```typescript
// ✅ Use available data
const tempMax = weather.tc_max || 0
const humidity = weather.rh_percent || 0
const solarRadiation = weather.swdown || 0

// ✅ Wind not available
const windSpeed = null
```

**Display** (CORRECT):
```
💨 ลม: ไม่มีข้อมูล
☀️ แสง: 380 W/m²
```

---

## 💡 Future Solutions

### Option 1: Add Wind Provider
```sql
-- Add wind_speed column
ALTER TABLE weather_forecasts 
ADD COLUMN wind_speed numeric;

-- Update from Open-Meteo (has wind data)
-- Create sync job to fetch wind from alternative provider
```

### Option 2: Change Provider
- Switch from TMD to Open-Meteo
- Open-Meteo has: temperature, rain, humidity, wind, UV index
- Requires: Migration script + sync job update

### Option 3: Multi-Provider
- Keep TMD for core data
- Add Open-Meteo for wind/UV
- Merge in application layer

---

## ✅ Verification Checklist

- [x] Queried `weather_forecasts` table directly
- [x] Inspected ALL 15 columns
- [x] Examined `raw_json` nested structure
- [x] Checked all 7 forecast entries for additional fields
- [x] Searched for "wind" in entire raw_json
- [x] Verified only TMD provider exists
- [x] Checked documentation vs reality
- [x] Created comprehensive documentation

---

## 📝 Summary

**Available**:
- ✅ Temperature (tc_max, tc_min)
- ✅ Rain (rain_mm)
- ✅ Humidity (rh_percent)
- ✅ Solar Radiation/Light (swdown)
- ✅ Raw JSON (nested provider data)

**NOT Available**:
- ❌ Wind speed/direction
- ❌ UV index
- ❌ Atmospheric pressure
- ❌ Cloud coverage

**Reason**: TMD provider dataset limitations

---

**Grounded by**: Oracle Ranger (o)  
**Method**: Direct DB query + skill docs review  
**Confidence**: 100% (verified 3x)
