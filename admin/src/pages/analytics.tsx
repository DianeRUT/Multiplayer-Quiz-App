import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Play, 
  Trophy, 
  MessageSquare, 
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

interface AnalyticsData {
  period: string
  users: number
  games: number
  questions: number
  revenue: number
}

const analyticsData: AnalyticsData[] = [
  { period: "Jan", users: 1200, games: 450, questions: 120, revenue: 2500 },
  { period: "Feb", users: 1350, games: 520, questions: 140, revenue: 2800 },
  { period: "Mar", users: 1100, games: 380, questions: 100, revenue: 2200 },
  { period: "Apr", users: 1600, games: 670, questions: 180, revenue: 3200 },
  { period: "May", users: 1420, games: 580, questions: 150, revenue: 2900 },
  { period: "Jun", users: 1780, games: 720, questions: 200, revenue: 3600 },
]

const categoryData = [
  { name: "Science", value: 35, color: "#3B82F6" },
  { name: "History", value: 25, color: "#10B981" },
  { name: "Entertainment", value: 20, color: "#F59E0B" },
  { name: "Sports", value: 15, color: "#EF4444" },
  { name: "Other", value: 5, color: "#8B5CF6" },
]

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("users")

  const handleExportData = () => {
    alert("Exporting analytics data... (This is a demo)")
  }

  const handleRefreshData = () => {
    alert("Refreshing analytics data... (This is a demo)")
  }

  const handleViewDetailedReport = (metric: string) => {
    alert(`Viewing detailed ${metric} report... (This is a demo)`)
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  const currentPeriodData = analyticsData[analyticsData.length - 1]
  const previousPeriodData = analyticsData[analyticsData.length - 2]

  const userGrowth = calculateGrowth(currentPeriodData.users, previousPeriodData.users)
  const gameGrowth = calculateGrowth(currentPeriodData.games, previousPeriodData.games)
  const questionGrowth = calculateGrowth(currentPeriodData.questions, previousPeriodData.questions)
  const revenueGrowth = calculateGrowth(currentPeriodData.revenue, previousPeriodData.revenue)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefreshData}>
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentPeriodData.users.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {userGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(userGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => handleViewDetailedReport("users")}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Games Played</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentPeriodData.games.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {gameGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${gameGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(gameGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => handleViewDetailedReport("games")}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentPeriodData.questions.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {questionGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${questionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(questionGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => handleViewDetailedReport("questions")}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${currentPeriodData.revenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => handleViewDetailedReport("revenue")}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Growth Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.map((data, index) => (
                <div key={data.period} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-sm font-medium">{data.period}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedMetric === "users" && `${data.users.toLocaleString()} users`}
                        {selectedMetric === "games" && `${data.games.toLocaleString()} games`}
                        {selectedMetric === "questions" && `${data.questions.toLocaleString()} questions`}
                        {selectedMetric === "revenue" && `$${data.revenue.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(selectedMetric === "users" ? data.users / 2000 : 
                                  selectedMetric === "games" ? data.games / 800 : 
                                  selectedMetric === "questions" ? data.questions / 250 : 
                                  data.revenue / 4000) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-2">
              {["users", "games", "questions", "revenue"].map((metric) => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric)}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: category.color,
                          width: `${category.value}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                      {category.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Insights</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Science category is most popular with {categoryData[0].value}% of questions</li>
                <li>• User engagement increased by {userGrowth.toFixed(1)}% this period</li>
                <li>• Average game completion rate: 78%</li>
                <li>• Peak activity hours: 7-9 PM EST</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily Active Users</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Active Users</span>
                <span className="text-sm font-medium">8,934</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Active Users</span>
                <span className="text-sm font-medium">32,156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                <span className="text-sm font-medium">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="text-sm font-medium">0.02%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">North America</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Europe</span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Asia Pacific</span>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Other</span>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
