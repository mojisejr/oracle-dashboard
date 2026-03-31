import { NextRequest, NextResponse } from 'next/server'
import { getLatestActivity } from '@/lib/queries'
import { getDaysSince } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const plot = searchParams.get('plot')
    const type = searchParams.get('type') as 'watering' | 'spraying' | 'fertilizing' | null

    // Validation
    if (!plot || !type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters: plot and type',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['watering', 'spraying', 'fertilizing']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Query database
    const data = await getLatestActivity(plot, type)

    if (!data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No activity found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    // Add computed fields
    const response = {
      success: true,
      data: {
        ...data,
        days_ago: getDaysSince(data.activity_date)
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
