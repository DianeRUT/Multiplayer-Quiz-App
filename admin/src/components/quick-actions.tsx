import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, HelpCircle, Settings, Trophy, Activity } from "lucide-react"

export function QuickActions() {
  const handleAddQuestion = () => {
    // Navigate to questions page or open modal
    window.location.href = "/questions"
  }

  const handleManageUsers = () => {
    window.location.href = "/users"
  }

  const handleReviewReports = () => {
    window.location.href = "/reports"
  }

  const handleSystemSettings = () => {
    window.location.href = "/settings"
  }

  const handleCreateTournament = () => {
    window.location.href = "/tournaments"
  }

  const handleViewActivity = () => {
    window.location.href = "/live-activity"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={handleAddQuestion}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Question
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={handleManageUsers}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={handleCreateTournament}
        >
          <Trophy className="mr-2 h-4 w-4" />
          Create Tournament
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={handleViewActivity}
        >
          <Activity className="mr-2 h-4 w-4" />
          View Live Activity
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={handleReviewReports}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Review Reports
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={handleSystemSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
      </CardContent>
    </Card>
  )
}
