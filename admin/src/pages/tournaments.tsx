import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trophy, Users, Calendar, Award, Play, Pause, Eye, Edit, Trash2, Loader2, Swords, Zap, Wifi, WifiOff } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { tournamentsAPI, quizzesAPI, battlesAPI, Tournament, Quiz, Battle } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import socketService from "@/services/socketService"
import LiveBattle from "@/components/LiveBattle"

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingBrackets, setIsGeneratingBrackets] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isConnected, setIsConnected] = useState(false)
  const [liveBattleId, setLiveBattleId] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [newTournament, setNewTournament] = useState({
    name: "",
    description: "",
    type: "SINGLE_ELIMINATION" as const,
    maxParticipants: 16,
    startDate: "",
    quizId: 0,
    creatorId: 4, // Admin user ID
    isPublic: false
  })

  // Fetch tournaments and quizzes on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Real-time socket connections
  useEffect(() => {
    // Check connection status
    const checkConnection = () => {
      setIsConnected(socketService.isSocketConnected())
    }

    // Listen for tournament updates
    const handleTournamentUpdate = (data: any) => {
      if (selectedTournament && data.tournamentId === selectedTournament.id) {
        fetchData() // Refresh tournaments
        if (selectedTournament) {
          // Refresh battles for current tournament
          battlesAPI.getTournamentBattles(selectedTournament.id).then(setBattles)
        }
      }
    }

    // Listen for bracket updates
    const handleBracketUpdate = (data: any) => {
      if (selectedTournament && data.tournamentId === selectedTournament.id) {
        setBattles(data.battles)
      }
    }

    // Listen for battle updates
    const handleBattleUpdate = (data: any) => {
      if (selectedTournament) {
        // Refresh battles for current tournament
        battlesAPI.getTournamentBattles(selectedTournament.id).then(setBattles)
      }
    }

    // Listen for admin notifications
    const handleAdminNotification = (data: any) => {
      toast({
        title: data.title,
        description: data.message,
        variant: data.type === 'error' ? 'destructive' : 'default'
      })
    }

    // Subscribe to events
    socketService.on('tournament-update', handleTournamentUpdate)
    socketService.on('bracket-update', handleBracketUpdate)
    socketService.on('battle-update', handleBattleUpdate)
    socketService.on('admin-notification', handleAdminNotification)

    // Check initial connection status
    checkConnection()

    // Set up connection status check interval
    const interval = setInterval(checkConnection, 5000)

    return () => {
      socketService.off('tournament-update', handleTournamentUpdate)
      socketService.off('bracket-update', handleBracketUpdate)
      socketService.off('battle-update', handleBattleUpdate)
      socketService.off('admin-notification', handleAdminNotification)
      clearInterval(interval)
    }
  }, [selectedTournament, toast])

  // Join tournament room when viewing details
  useEffect(() => {
    if (selectedTournament) {
      socketService.joinTournament(selectedTournament.id)
    }

    return () => {
      if (selectedTournament) {
        socketService.leaveTournament(selectedTournament.id)
      }
    }
  }, [selectedTournament])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tournamentsData, quizzesData] = await Promise.all([
        tournamentsAPI.getAll(),
        quizzesAPI.getAll()
      ])
      setTournaments(tournamentsData)
      setQuizzes(quizzesData)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch tournaments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTournament = async () => {
    if (!newTournament.name || !newTournament.startDate || !newTournament.quizId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      const tournament = await tournamentsAPI.create(newTournament)
      setTournaments([tournament, ...tournaments])
      setNewTournament({
        name: "",
        description: "",
        type: "SINGLE_ELIMINATION",
        maxParticipants: 16,
        startDate: "",
        quizId: 0,
        creatorId: 4,
        isPublic: false
      })
      setIsCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "Tournament created successfully"
      })
    } catch (error: any) {
      console.error('Error creating tournament:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tournament",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTournament = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return

    try {
      await tournamentsAPI.delete(id)
      setTournaments(tournaments.filter(tournament => tournament.id !== id))
      toast({
        title: "Success",
        description: "Tournament deleted successfully"
      })
    } catch (error: any) {
      console.error('Error deleting tournament:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete tournament",
        variant: "destructive"
      })
    }
  }

  const handleStartTournament = async (id: number) => {
    try {
      const updatedTournament = await tournamentsAPI.start(id)
      setTournaments(tournaments.map(tournament => 
        tournament.id === id ? updatedTournament : tournament
      ))
      toast({
        title: "Success",
        description: "Tournament started successfully"
      })
    } catch (error: any) {
      console.error('Error starting tournament:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to start tournament",
        variant: "destructive"
      })
    }
  }

  const handleViewDetails = async (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setActiveTab("details")
    setIsDetailsDialogOpen(true)
    
    // Fetch battles for this tournament
    try {
      const tournamentBattles = await battlesAPI.getTournamentBattles(tournament.id)
      setBattles(tournamentBattles)
    } catch (error: any) {
      console.error('Error fetching battles:', error)
      setBattles([])
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
        title: "Success",
        description: `Battle ended. Winner: ${result.winnerId ? `Player ${result.winnerId}` : 'Draw'}`
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

  const handleViewLiveBattle = (battleId: number) => {
    setLiveBattleId(battleId)
  }

  const handleCloseLiveBattle = () => {
    setLiveBattleId(null)
  }

  const getStatusColor = (status: string) => {
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

  const getBattleStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "SCHEDULED":
      case "WAITING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "FINISHED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tournaments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage competitive quiz tournaments</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Tournament Details Dialog with Tabs */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tournament Details</DialogTitle>
            <DialogDescription>
              Manage tournament details and battles
            </DialogDescription>
          </DialogHeader>
          {selectedTournament && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="battles">Battles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-lg font-semibold">{selectedTournament.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={getStatusColor(selectedTournament.status)}>
                      {selectedTournament.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Type</Label>
                    <p className="text-sm">{selectedTournament.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Quiz</Label>
                    <p className="text-sm">
                      {quizzes.find(q => q.id === selectedTournament.quizId)?.title || 'Unknown Quiz'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Participants</Label>
                    <p className="text-sm">
                      {selectedTournament.currentParticipants}/{selectedTournament.maxParticipants}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Public</Label>
                    <p className="text-sm">{selectedTournament.isPublic ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Description */}
                {selectedTournament.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {selectedTournament.description}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                    <p className="text-sm">{formatDate(selectedTournament.startDate)}</p>
                  </div>
                  {selectedTournament.endDate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">End Date</Label>
                      <p className="text-sm">{formatDate(selectedTournament.endDate)}</p>
                    </div>
                  )}
                </div>

                {/* Settings */}
                {selectedTournament.settings && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Settings</Label>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {selectedTournament.settings.timeLimit && (
                          <div>Time Limit: {selectedTournament.settings.timeLimit}s</div>
                        )}
                        {selectedTournament.settings.questionsPerBattle && (
                          <div>Questions per Battle: {selectedTournament.settings.questionsPerBattle}</div>
                        )}
                        {selectedTournament.settings.allowSpectators !== undefined && (
                          <div>Allow Spectators: {selectedTournament.settings.allowSpectators ? 'Yes' : 'No'}</div>
                        )}
                        {selectedTournament.settings.autoStart !== undefined && (
                          <div>Auto Start: {selectedTournament.settings.autoStart ? 'Yes' : 'No'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Participants */}
                {selectedTournament.participants && selectedTournament.participants.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Participants</Label>
                    <div className="mt-2 space-y-2">
                      {selectedTournament.participants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {participant.user?.name || `User ${participant.userId}`}
                            </span>
                            {participant.isEliminated && (
                              <Badge variant="destructive" className="text-xs">Eliminated</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Score: {participant.score} | W: {participant.wins} | L: {participant.losses}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                    Close
                  </Button>
                  {selectedTournament.status === "UPCOMING" && (
                    <Button onClick={() => {
                      handleStartTournament(selectedTournament.id)
                      setIsDetailsDialogOpen(false)
                    }}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Tournament
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="battles" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Tournament Battles</h3>
                    <p className="text-sm text-gray-600">
                      Manage battles for {selectedTournament.name}
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
                                <div className="text-sm text-gray-500">{battle.name}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {battle.participants && battle.participants.length >= 2 ? (
                                  <>
                                    <div className="text-center">
                                      <div className="font-medium">
                                        {battle.participants[0]?.user?.name || `Player ${battle.participants[0]?.userId}`}
                                      </div>
                                      <div className="text-sm text-gray-500">Score: {battle.participants[0]?.score || 0}</div>
                                    </div>
                                    <Swords className="h-4 w-4 text-gray-400" />
                                    <div className="text-center">
                                      <div className="font-medium">
                                        {battle.participants[1]?.user?.name || `Player ${battle.participants[1]?.userId}`}
                                      </div>
                                      <div className="text-sm text-gray-500">Score: {battle.participants[1]?.score || 0}</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">Waiting for participants...</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getBattleStatusColor(battle.status)}>
                                {battle.status}
                              </Badge>
                              <div className="flex space-x-1">
                                {(battle.status === "SCHEDULED" || battle.status === "WAITING") && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleStartBattle(battle.id)}
                                    variant="outline"
                                  >
                                    <Play className="h-3 w-3" />
                                  </Button>
                                )}
                                {battle.status === "ACTIVE" && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleViewLiveBattle(battle.id)}
                                      variant="outline"
                                      className="bg-green-50 text-green-700 hover:bg-green-100"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleEndBattle(battle.id)}
                                      variant="outline"
                                    >
                                      End
                                    </Button>
                                  </>
                                )}
                                {battle.results?.winnerId && (
                                  <Badge variant="secondary" className="text-xs">
                                    Winner: {battle.results.winnerId}
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
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tournaments yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first tournament to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Tournament
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                      <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{tournament.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quizzes.find(q => q.id === tournament.quizId)?.title || 'Unknown Quiz'}
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
                      <DropdownMenuItem onClick={() => handleViewDetails(tournament)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {tournament.status === "UPCOMING" && (
                        <DropdownMenuItem onClick={() => handleStartTournament(tournament.id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Tournament
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteTournament(tournament.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Tournament
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
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {tournament.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(tournament.startDate)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={getStatusColor(tournament.status)}
                    >
                      {tournament.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(tournament)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Live Battle Modal */}
      {liveBattleId && (
        <LiveBattle 
          battleId={liveBattleId} 
          onClose={handleCloseLiveBattle} 
        />
      )}
    </div>
  )
}
