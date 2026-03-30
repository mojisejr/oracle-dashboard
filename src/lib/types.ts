export interface Database {
  url: string
  key: string
}

export interface WeatherForecast {
  id: string
  location_id: string
  forecast_date: string
  temp_min: number
  temp_max: number
  rain_mm: number
  wind_speed: number
  humidity: number
  created_at: string
}

export interface OrchardActivity {
  id: string
  plot_name: string
  activity_type: 'watering' | 'spraying' | 'fertilizing' | 'harvesting' | 'pruning' | 'observation'
  activity_date: string
  details: Record<string, any>
  notes?: string
  created_at: string
}

export interface LatestActivities {
  watering: {
    date: string | null
    days_since: number | null
    plot_name: string | null
  }
  spraying: {
    date: string | null
    days_since: number | null
    plot_name: string | null
    formulation?: string
  }
  fertilizing: {
    date: string | null
    days_since: number | null
    plot_name: string | null
    fertilizer_type?: string
  }
}

export interface SprayDecision {
  canSpray: boolean
  reasons: string[]
  recommendations: string[]
  weather_check: {
    rain: boolean
    wind: boolean
    temperature: 'ok' | 'warning'
  }
  interval_check: {
    days_since_last: number | null
    min_interval: number
    status: 'ok' | 'due_soon' | 'overdue'
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}
