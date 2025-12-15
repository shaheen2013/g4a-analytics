import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({
      access_token: session.accessToken as string,
    })

    const analyticsData = google.analyticsdata('v1beta')
    const propertyId = process.env.GA_PROPERTY_ID || 'properties/YOUR_PROPERTY_ID'

    // Get metrics for the last 7 days
    const response = await analyticsData.properties.runReport({
      property: propertyId,
      requestBody: {
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
        ],
      },
      auth: oauth2Client,
    })

    // Get top pages
    const topPagesResponse = await analyticsData.properties.runReport({
      property: propertyId,
      requestBody: {
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [{ name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: '10',
      },
      auth: oauth2Client,
    })

    // Get country data
    const countryResponse = await analyticsData.properties.runReport({
      property: propertyId,
      requestBody: {
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        limit: '10',
      },
      auth: oauth2Client,
    })

    return NextResponse.json({
      timeSeries: response.data,
      topPages: topPagesResponse.data,
      countries: countryResponse.data,
    })
  } catch (error: any) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

