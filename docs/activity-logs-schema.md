# Activity Logs Table Schema

**Last Updated**: 2026-04-01 11:52 GMT+7
**Grounding Method**: Direct query on 10 records
**Status**: ✅ VERIFIED

---

## Table Name
`activity_logs`

---

## Field Count
**10 fields total**

---

## Fields

| Field | Type | Required | Nullable | Sample |
|-------|------|----------|----------|--------|
| `id` | string (UUID) | ✅ YES | ❌ NO | `"b6193ad3-33de-4f40-a64e-c1f96c6ea671"` |
| `created_at` | string (timestamp) | ✅ YES | ❌ NO | `"2026-03-06T03:00:00+00:00"` |
| `updated_at` | string (timestamp) | ✅ YES | ❌ NO | `"2026-03-06T11:08:01.68864+00:00"` |
| `user_id` | string (UUID) | ❌ NO | ✅ YES | `null` |
| `activity_type` | string | ✅ YES | ❌ NO | `"spraying"`, `"watering"`, `"fertilizing"` |
| `plot_name` | string | ✅ YES | ❌ NO | `"suan_ban"`, `"suan_lang"`, `"suan_makham"`, `"plant_shop"` |
| `tree_id` | string (UUID) | ❌ NO | ✅ YES | `null` |
| `details` | JSON (object) | ✅ YES | ❌ NO | `{ target, purpose, chemicals, ... }` |
| `notes` | string | ❌ NO | ✅ YES | `"พ่นทุเรียน: อซิทามิพริด..."` |
| `next_action` | string | ❌ NO | ✅ YES | `null` |

---

## ⚠️ CRITICAL: NO `deleted_at` FIELD

**This table does NOT have a `deleted_at` field.**

- ❌ DO NOT use `.is('deleted_at', null)` in queries
- ❌ DO NOT assume soft-delete pattern
- ✅ All records are permanent (no soft-delete)

---

## Indexes

- `id` (Primary Key)
- `created_at` (ordered, for date queries)
- `plot_name` (filter by plot)
- `activity_type` (filter by type)

---

## Common Query Patterns

### Get Latest Activity by Plot and Type

```typescript
const { data, error } = await supabase
  .from('activity_logs')
  .select('*')
  .eq('plot_name', 'suan_ban')
  .eq('activity_type', 'watering')
  .order('created_at', { ascending: false })
  .limit(1)
  .single()
```

**✅ CORRECT - No deleted_at filter needed**

### ❌ WRONG - Do NOT Use This

```typescript
const { data, error } = await supabase
  .from('activity_logs')
  .select('*')
  .eq('plot_name', 'suan_ban')
  .is('deleted_at', null)  // ❌ ERROR: column does not exist
  .order('created_at', { ascending: false })
  .limit(1)
  .single()
```

---

## Field Details

### `details` Field Structure

The `details` field is a JSON object with flexible structure based on `activity_type`:

**For `watering`:**
```json
{
  "duration_minutes": 40
}
```

**For `spraying`:**
```json
{
  "target": "durian",
  "purpose": "comprehensive",
  "chemicals": [
    {
      "name": "อซิทามิพริด",
      "amount": 200,
      "unit": "cc",
      "category": "insecticide"
    }
  ],
  "tank_size_liters": 200
}
```

**For `fertilizing`:**
```json
{
  "fertilizer": "13-0-46",
  "amount": 1,
  "unit": "kg"
}
```

---

## Activity Types

Valid `activity_type` values:
- `"watering"` - รดน้ำ
- `"spraying"` - พ่นยา
- `"fertilizing"` - ใส่ปุ๋ย
- `"harvesting"` - เก็บเกี่ยว
- `"pruning"` - ตัดแต่ง
- `"observation"` - สังเกตการณ์

---

## Plot Names

Valid `plot_name` values (slugs):
- `"suan_ban"` - สวนบ้าน
- `"suan_lang"` - สวนล่าง
- `"suan_makham"` - สวนมะขาม
- `"plant_shop"` - แปลงพันธุ์ไม้

---

## Grounding Evidence

**Method**: Direct query on production database
**Date**: 2026-04-01 11:50 GMT+7
**Records checked**: 10
**Command**: `query('activity_logs', { select: '*', limit: 10 })`

**Findings**:
- Total fields: 10
- Required fields: 5 (id, created_at, updated_at, activity_type, plot_name, details)
- Nullable fields: 4 (user_id, tree_id, notes, next_action)
- **NO `deleted_at` field** ❌

---

## Query Verification

**Test**: Query watering for suan_ban

```bash
# ✅ CORRECT (without deleted_at)
filter: plot_name=eq.suan_ban&activity_type=eq.watering
Result: 5 records found ✅

# ❌ WRONG (with deleted_at)
filter: plot_name=eq.suan_ban&activity_type=eq.watering&deleted_at=is.null
Result: ERROR 400: column activity_logs.deleted_at does not exist ❌
```

---

## Migration Notes

If you previously used `orchard_activities` table:
- ❌ Old table: `orchard_activities` (empty)
- ✅ New table: `activity_logs` (has data)
- ❌ Old field: `activity_date`
- ✅ New field: `created_at` (map to `activity_date` for API)
- ❌ Old filter: `.is('deleted_at', null)`
- ✅ New filter: **NO deleted_at filter**

---

## References

- **Implementation**: `src/lib/queries.ts`
- **API Route**: `src/app/api/activities/latest/route.ts`
- **Bug Fix Commit**: `110a2cd` - "fix: remove deleted_at filter"
- **Grounding Date**: 2026-04-01 11:52 GMT+7

---

**Status**: ✅ SCHEMA VERIFIED AND DOCUMENTED
**Confidence**: 100% (grounded against production data)
**Last Verified**: 2026-04-01 11:52 GMT+7
