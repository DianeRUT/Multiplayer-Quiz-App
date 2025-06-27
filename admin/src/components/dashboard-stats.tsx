import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, HelpCircle, Trophy, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,543",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Games",
    value: "1,234",
    change: "+8%",
    changeType: "positive" as const,
    icon: Trophy,
  },
  {
    title: "Questions",
    value: "8,765",
    change: "+23%",
    changeType: "positive" as const,
    icon: HelpCircle,
  },
  {
    title: "Engagement",
    value: "89.2%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
