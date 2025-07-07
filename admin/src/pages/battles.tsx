import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Swords, Play, Eye, Loader2, Zap, Trophy, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { tournamentsAPI, battlesAPI, Tournament, Battle } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export function Battles() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [isBattlesDialogOpen, setIsBattlesDialogOpen] = useState(false)
  const [isGeneratingBrackets, setIsGeneratingBrackets] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const tournamentsData = await tournamentsAPI.getAll()
      setTournaments(tournamentsData)
    } catch (error: any) {
      console.error('Error fetching tournaments:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch tournaments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewBattles = async (tournament: Tournament) => {
    try {
      setSelectedTournament(tournament)
      const tournamentBattles = await battlesAPI.getTournamentBattles(tournament.id)
      setBattles(tournamentBattles)
      setIsBattlesDialogOpen(true)
    } catch (error: any) {
      console.error('Error fetching battles:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch battles",
        variant: "destructive"
      })
    }
  }

  const handleGenerateBrackets = async (tournamentId: number) => {
    try {
      setIsGeneratingBrackets(true)
      const newBattles = await battlesAPI.generateBrackets(tournamentId)
      setBattles(newBattles)
      toast({
        title: "Success",
        description: `Generated ${newBattles.length} battles for the tournament`
      })
    } catch (error: any) {
      console.error('Error generating brackets:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate brackets",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingBrackets(false)
    }
  }

  const handleStartBattle = async (battleId: number) => {
    try {
      await battlesAPI.start(battleId)
      // Refresh battles
      if (selectedTournament) {
        const updatedBattles = await battlesAPI.getTournamentBattles(selectedTournament.id)
        setBattles(updatedBattles)
      }
      toast({
        title: "Success",
        description: "Battle started successfully"
      })
    } catch (error: any) {
      console.error('Error starting battle:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to start battle",
        variant: "destructive"
      })
    }
  }

  const handleEndBattle = async (battleId: number) => {
    try {
      const result = await battlesAPI.end(battleId)
      // Refresh battles
      if (selectedTournament) {
        const updatedBattles = await battlesAPI.getTournamentBattles(selectedTournament.id)
        setBattles(updatedBattles)
      }
      toast({
        title: "Battle Ended",
        description: result.winnerId ? `Winner: User ${result.winnerId}` : "Battle ended in a draw"
      })
    } catch (error: any) {
      console.error('Error ending battle:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to end battle",
        variant: "destructive"
      })
    }
  }

  const getBattleStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "FINISHED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTournamentStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "UPCOMING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "FINISHED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "REGISTRATION":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tournaments...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tournament Battles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage battles and brackets for tournaments</p>
        </div>
      </div>

      {/* Battles Dialog */}
      <Dialog open={isBattlesDialogOpen} onOpenChange={setIsBattlesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tournament Battles</DialogTitle>
            <DialogDescription>
              Manage battles for {selectedTournament?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTournament && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTournament.name}</h3>
                  <p className="text-sm text-gray-600">
                    Status: {selectedTournament.status} | Participants: {selectedTournament.currentParticipants}/{selectedTournament.maxParticipants}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleGenerateBrackets(selectedTournament.id)}
                    disabled={isGeneratingBrackets}
                    variant="outline"
                  >
                    {isGeneratingBrackets ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Brackets
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {battles.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Swords className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No battles yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Generate brackets to create battles for this tournament
                    </p>
                    <Button 
                      onClick={() => handleGenerateBrackets(selectedTournament.id)}
                      disabled={isGeneratingBrackets}
                    >
                      {isGeneratingBrackets ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Generate Brackets
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {battles.map((battle) => (
                    <Card key={battle.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="font-semibold">Round {battle.round}</div>
                              <div className="text-sm text-gray-500">Battle #{battle.id}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-center">
                                <div className="font-medium">Player 1</div>
                                <div className="text-sm text-gray-500">Score: {battle.player1Score}</div>
                              </div>
                              <Swords className="h-4 w-4 text-gray-400" />
                              <div className="text-center">
                                <div className="font-medium">Player 2</div>
                                <div className="text-sm text-gray-500">Score: {battle.player2Score}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getBattleStatusColor(battle.status)}>
                              {battle.status}
                            </Badge>
                            <div className="flex space-x-1">
                              {battle.status === "PENDING" && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStartBattle(battle.id)}
                                  variant="outline"
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                              {battle.status === "ACTIVE" && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleEndBattle(battle.id)}
                                  variant="outline"
                                >
                                  End
                                </Button>
                              )}
                              {battle.winnerId && (
                                <Badge variant="secondary" className="text-xs">
                                  Winner: {battle.winnerId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tournaments found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create tournaments first to manage battles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900">
                      <Swords className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{tournament.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tournament.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewBattles(tournament)}>
                        <Swords className="mr-2 h-4 w-4" />
                        View Battles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {tournament.description || "No description provided"}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Participants</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <Badge className={getTournamentStatusColor(tournament.status)}>
                      {tournament.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewBattles(tournament)}
                  >
                    <Swords className="mr-2 h-4 w-4" />
                    Manage Battles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 