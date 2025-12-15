'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  timeSeries: any
  topPages: any
  countries: any
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
        <p className="font-bold">Error loading analytics</p>
        <p>{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  // Transform data for charts
  const timeSeriesData = data.timeSeries?.rows?.map((row: any) => ({
    date: row.dimensionValues?.[0]?.value || '',
    users: parseInt(row.metricValues?.[0]?.value || '0'),
    sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
  })) || []

  const topPagesData = data.topPages?.rows?.map((row: any) => ({
    page: row.dimensionValues?.[0]?.value || 'Unknown',
    views: parseInt(row.metricValues?.[0]?.value || '0'),
  })) || []

  const countriesData = data.countries?.rows?.map((row: any) => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    users: parseInt(row.metricValues?.[0]?.value || '0'),
  })) || []

  // Calculate totals
  const totalUsers = timeSeriesData.reduce((sum: number, item: any) => sum + item.users, 0)
  const totalSessions = timeSeriesData.reduce((sum: number, item: any) => sum + item.sessions, 0)
  const totalPageViews = timeSeriesData.reduce((sum: number, item: any) => sum + item.pageViews, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sessions</h3>
          <p className="text-3xl font-bold mt-2">{totalSessions.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Page Views</h3>
          <p className="text-3xl font-bold mt-2">{totalPageViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Users Over Time Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Users & Sessions (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
            <Line type="monotone" dataKey="sessions" stroke="#82ca9d" name="Sessions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Pages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Top Pages</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPagesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="page" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Countries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Top Countries</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countriesData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="country" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="users" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

