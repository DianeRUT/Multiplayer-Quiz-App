import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dashboardAPI, ActiveGame } from "@/services/dashboardService"
import { Loader2, Users, Clock, Play } from "lucide-react"

export function ActiveGames() {
  const [games, setGames] = useState<ActiveGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        setLoading(true)
        const data = await dashboardAPI.getActiveGames()
        setGames(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching active games:', err)
        setError('Failed to load active games')
      } finally {
        setLoading(false)
      }
    }

    fetchActiveGames()

    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchActiveGames, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'WAITING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'FINISHED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Play className="h-3 w-3" />
      case 'WAITING':
        return <Clock className="h-3 w-3" />
      case 'FINISHED':
        return <Users className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active games</h3>
            <p className="text-gray-600 dark:text-gray-400">
              There are currently no active games running.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Active Games</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{game.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {game.players} players • {game.category}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Started {new Date(game.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <Badge
                variant="outline"
                className={getStatusColor(game.status)}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(game.status)}
                  {game.status.toLowerCase()}
                </div>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
