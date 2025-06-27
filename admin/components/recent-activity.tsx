"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const activities = [
  {
    user: "Alice Johnson",
    action: "completed a quiz battle",
    time: "2 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    user: "Bob Smith",
    action: "joined the platform",
    time: "5 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    user: "Charlie Brown",
    action: "achieved a new high score",
    time: "8 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    user: "Diana Prince",
    action: "reported inappropriate content",
    time: "12 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    user: "Eve Wilson",
    action: "completed daily challenge",
    time: "15 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function RecentActivity() {
  return (
    <Card className="animate-slide-in border-0 shadow-md bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription>Latest user actions and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-background/50 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback className="bg-teal-500 text-white">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
