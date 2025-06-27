import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity, 
  Users, 
  Play, 
  Trophy, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Filter,
  RefreshCw,
  Eye,
  Volume2,
  VolumeX
} from "lucide-react"

interface ActivityItem {
  id: number
  type: string
  user: string
  action: string
  timestamp: string
  details: string
  severity: "low" | "medium" | "high"
  avatar: string
  icon: any
  color: string
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    type: "game",
    user: "John Doe",
    action: "started a new game",
    timestamp: "2 minutes ago",
    details: "Science Trivia Battle",
    severity: "low",
    avatar: "/placeholder.svg?height=32&width=32",
    icon: Play,
    color: "#10B981",
  },
  {
    id: 2,
    type: "user",
    user: "Sarah Wilson",
    action: "joined the platform",
    timestamp: "5 minutes ago",
    details: "New user registration",
    severity: "low",
    avatar: "/placeholder.svg?height=32&width=32",
    icon: Users,
    color: "#3B82F6",
  },
  {
    id: 3,
    type: "tournament",
    user: "Mike Johnson",
    action: "won a tournament",
    timestamp: "8 minutes ago",
    details: "History Masters Championship",
    severity: "medium",
    avatar: "/placeholder.svg?height=32&width=32",
    icon: Trophy,
    color: "#F59E0B",
  },
  {
    id: 4,
    type: "chat",
    user: "Lisa Brown",
    action: "reported inappropriate content",
    timestamp: "12 minutes ago",
    details: "Message flagged for review",
    severity: "high",
    avatar: "/placeholder.svg?height=32&width=32",
    icon: AlertTriangle,
    color: "#EF4444",
  },
  {
    id: 5,
    type: "system",
    user: "System",
    action: "backup completed",
    timestamp: "15 minutes ago",
    details: "Daily database backup",
    severity: "low",
    avatar: "/placeholder.svg?height=32&width=32",
    icon: CheckCircle,
    color: "#10B981",
  },
]

export function LiveActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities)
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [isLive, setIsLive] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const filteredActivities = activities.filter(activity => 
    (selectedType === "all" || activity.type === selectedType) &&
    (selectedSeverity === "all" || activity.severity === selectedSeverity)
  )

  const handleRefresh = () => {
    // Simulate new activity
    const newActivity: ActivityItem = {
      id: Date.now(),
      type: "game",
      user: "New User",
      action: "completed a quiz",
      timestamp: "Just now",
      details: "General Knowledge Quiz",
      severity: "low",
      avatar: "/placeholder.svg?height=32&width=32",
      icon: Play,
      color: "#10B981",
    }
    setActivities([newActivity, ...activities.slice(0, 19)]) // Keep only 20 items
    alert("Activity refreshed!")
  }

  const handleViewDetails = (id: number) => {
    const activity = activities.find(a => a.id === id)
    alert(`Viewing details for: ${activity?.action} (This is a demo)`)
  }

  const handleClearActivity = () => {
    if (confirm("Are you sure you want to clear all activity logs?")) {
      setActivities([])
      alert("Activity logs cleared!")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "game":
        return Play
      case "user":
        return Users
      case "tournament":
        return Trophy
      case "chat":
        return MessageSquare
      case "system":
        return CheckCircle
      default:
        return Activity
    }
  }

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (isLive) {
        const newActivity: ActivityItem = {
          id: Date.now(),
          type: ["game", "user", "system"][Math.floor(Math.random() * 3)],
          user: ["Alice", "Bob", "Charlie", "Diana"][Math.floor(Math.random() * 4)],
          action: "performed an action",
          timestamp: "Just now",
          details: "Random activity",
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          avatar: "/placeholder.svg?height=32&width=32",
          icon: Activity,
          color: "#6B7280",
        }
        setActivities(prev => [newActivity, ...prev.slice(0, 19)])
      }
    }, 10000) // Add new activity every 10 seconds

    return () => clearInterval(interval)
  }, [isLive, autoRefresh])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Activity</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor real-time platform activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={isLive ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <Activity className="mr-2 h-4 w-4" />
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activities.filter(a => a.type === "user").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Games</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activities.filter(a => a.type === "game").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activities.filter(a => a.severity === "high").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Feed</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="game">Games</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="tournament">Tournaments</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleClearActivity}>
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} alt={activity.user} />
                  <AvatarFallback>
                    {activity.user.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${activity.color}15` }}
                  >
                    <activity.icon className="h-4 w-4" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={getSeverityColor(activity.severity)}
                  >
                    {activity.severity}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.timestamp}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(activity.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No activities found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
