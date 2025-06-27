"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Clock, Users } from "lucide-react"

const activeGames = [
  {
    id: "game-001",
    players: ["Alice", "Bob"],
    category: "Science",
    timeLeft: "45s",
    round: "3/5",
  },
  {
    id: "game-002",
    players: ["Charlie", "Diana"],
    category: "History",
    timeLeft: "12s",
    round: "1/5",
  },
  {
    id: "game-003",
    players: ["Eve", "Frank"],
    category: "Sports",
    timeLeft: "28s",
    round: "4/5",
  },
]

export function ActiveGames() {
  return (
    <Card className="animate-slide-in border-0 shadow-md bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Active Games</CardTitle>
        <CardDescription>Currently ongoing quiz battles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{game.players.join(" vs ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
                  >
                    {game.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Round {game.round}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                {game.timeLeft}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
