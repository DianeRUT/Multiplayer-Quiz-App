import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { dashboardAPI, UserGrowthData } from "@/services/dashboardService"
import { Loader2, TrendingUp } from "lucide-react"

export function UserGrowthChart() {
  const [data, setData] = useState<UserGrowthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        setLoading(true)
        const growthData = await dashboardAPI.getUserGrowth(30)
        setData(growthData)
        setError(null)
      } catch (err) {
        console.error('Error fetching user growth:', err)
        setError('Failed to load user growth data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserGrowth()

    // Refresh every 5 minutes
    const interval = setInterval(fetchUserGrowth, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No data available</h3>
              <p className="text-gray-600 dark:text-gray-400">
                User growth data will appear here once users start registering.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Transform data for the chart
  const chartData = data.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.users,
    growth: item.growth
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: any, name: any) => [
                name === 'users' ? `${value} users` : `${value}%`,
                name === 'users' ? 'Total Users' : 'Growth Rate'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#14b8a6" 
              strokeWidth={2} 
              dot={{ fill: "#14b8a6" }} 
            />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              dot={{ fill: "#f59e0b" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
