"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, GamepadIcon, Trophy, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    gradient: "from-teal-500 to-emerald-600",
    bgColor: "bg-teal-50 border-teal-200 dark:bg-teal-950/50 dark:border-teal-800",
    iconColor: "text-teal-600",
    textColor: "text-teal-800 dark:text-teal-200",
  },
  {
    title: "Active Games",
    value: "234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: GamepadIcon,
    gradient: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-800 dark:text-emerald-200",
  },
  {
    title: "Games Today",
    value: "1,429",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: Trophy,
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800",
    iconColor: "text-orange-600",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  {
    title: "Revenue",
    value: "$8,492",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: TrendingUp,
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 border-pink-200 dark:bg-pink-950/50 dark:border-pink-800",
    iconColor: "text-pink-600",
    textColor: "text-pink-800 dark:text-pink-200",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`hover:shadow-lg transition-all duration-200 border-0 shadow-md ${stat.bgColor} animate-slide-in`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-xs sm:text-sm font-medium ${stat.textColor}`}>{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
              <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"}>
                {stat.change}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
