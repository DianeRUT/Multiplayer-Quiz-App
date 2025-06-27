import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activeGames = [
  {
    id: 1,
    name: "Science Quiz Championship",
    players: 24,
    status: "live",
    category: "Science",
  },
  {
    id: 2,
    name: "History Trivia Night",
    players: 18,
    status: "live",
    category: "History",
  },
  {
    id: 3,
    name: "Sports Knowledge Battle",
    players: 32,
    status: "live",
    category: "Sports",
  },
  {
    id: 4,
    name: "Movie Buff Challenge",
    players: 15,
    status: "waiting",
    category: "Movies",
  },
]

export function ActiveGames() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Active Games</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGames.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{game.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {game.players} players • {game.category}
                </p>
              </div>
              <Badge
                variant={game.status === "live" ? "default" : "secondary"}
                className={
                  game.status === "live" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                }
              >
                {game.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
