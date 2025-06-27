"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Users, HelpCircle, Trophy, AlertTriangle } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Add Question",
      description: "Create new quiz questions",
      icon: HelpCircle,
      color: "teal-gradient text-white hover:scale-105",
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: Users,
      color: "emerald-gradient text-white hover:scale-105",
    },
    {
      title: "Create Tournament",
      description: "Set up new tournament",
      icon: Trophy,
      color: "coral-gradient text-white hover:scale-105",
    },
    {
      title: "View Reports",
      description: "Check user reports",
      icon: AlertTriangle,
      color: "warning-gradient text-white hover:scale-105",
    },
  ]

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-20 sm:h-24 flex-col space-y-2 ${action.color} border-0 transition-all duration-200`}
            >
              <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <div className="text-center">
                <div className="font-medium text-xs sm:text-sm">{action.title}</div>
                <div className="text-xs opacity-90 hidden sm:block">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
