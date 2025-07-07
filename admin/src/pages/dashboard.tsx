import { DashboardStatsComponent } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { UserGrowthChart } from "@/components/user-growth-chart"
import { ActiveGames } from "@/components/active-games"
import { RecentActivityComponent } from "@/components/recent-activity"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your quiz platform.
        </p>
      </div>

      <DashboardStatsComponent />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserGrowthChart />
          <ActiveGames />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentActivityComponent />
        </div>
      </div>
    </div>
  )
}
