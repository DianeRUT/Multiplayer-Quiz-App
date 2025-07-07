import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, HelpCircle, Trophy, TrendingUp } from "lucide-react"
import { dashboardAPI } from "@/services/dashboardService"
import type { DashboardStats } from "@/services/dashboardService"


export function DashboardStatsComponent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await dashboardAPI.getStats()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {i === 0 ? "Total Users" : i === 1 ? "Active Games" : i === 2 ? "Questions" : "Engagement"}
              </CardTitle>
              {i === 0 ? <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" /> :
               i === 1 ? <Trophy className="h-4 w-4 text-gray-600 dark:text-gray-400" /> :
               i === 2 ? <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" /> :
               <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">--</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Data unavailable</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      change: `${stats?.userGrowth?.growth || 0}%`,
      changeType: (stats?.userGrowth?.growth || 0) >= 0 ? "positive" as const : "negative" as const,
      icon: Users,
    },
    {
      title: "Active Games",
      value: stats?.activeGames?.toString() || "0",
      change: `${stats?.gameGrowth?.growth || 0}%`,
      changeType: (stats?.gameGrowth?.growth || 0) >= 0 ? "positive" as const : "negative" as const,
      icon: Trophy,
    },
    {
      title: "Questions",
      value: stats?.totalQuestions?.toLocaleString() || "0",
      change: `${stats?.questionGrowth?.growth || 0}%`,
      changeType: (stats?.questionGrowth?.growth || 0) >= 0 ? "positive" as const : "negative" as const,
      icon: HelpCircle,
    },
    {
      title: "Engagement",
      value: `${stats?.engagementRate?.rate || 0}%`,
      change: `${stats?.engagementRate?.rate || 0}%`,
      changeType: (stats?.engagementRate?.rate || 0) >= 50 ? "positive" as const : "negative" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <p className={`text-xs mt-1 ${
              stat.changeType === "positive" 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {stat.changeType === "positive" ? "+" : ""}{stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
