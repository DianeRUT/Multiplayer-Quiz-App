"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function UserGrowthChart() {
  return (
    <Card className="animate-slide-in border-0 shadow-md bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">User Growth</CardTitle>
        <CardDescription>New user registrations over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-2">+2,847</div>
            <div className="text-sm">New users this month</div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
