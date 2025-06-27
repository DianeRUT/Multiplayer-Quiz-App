import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trophy, Users, Calendar, Award, Play, Pause, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Tournament {
  id: number
  name: string
  description: string
  status: string
  participants: number
  maxParticipants: number
  startDate: string
  endDate: string
  prize: string
  category: string
  color: string
}

const initialTournaments: Tournament[] = [
  {
    id: 1,
    name: "Science Championship 2024",
    description: "The ultimate science trivia competition",
    status: "Active",
    participants: 156,
    maxParticipants: 200,
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    prize: "$1000",
    category: "Science",
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "History Masters Tournament",
    description: "Test your historical knowledge",
    status: "Upcoming",
    participants: 89,
    maxParticipants: 150,
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    prize: "$750",
    category: "History",
    color: "#10B981",
  },
  {
    id: 3,
    name: "Entertainment Quiz Fest",
    description: "Movies, music, and pop culture",
    status: "Completed",
    participants: 234,
    maxParticipants: 250,
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    prize: "$500",
    category: "Entertainment",
    color: "#F59E0B",
  },
]

const categories = ["Science", "History", "Entertainment", "Sports", "Geography", "Literature", "Technology", "General"]
const prizeOptions = ["$100", "$250", "$500", "$750", "$1000", "$1500", "$2000"]

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTournament, setNewTournament] = useState({
    name: "",
    description: "",
    category: "General",
    maxParticipants: 100,
    startDate: "",
    endDate: "",
    prize: "$250"
  })

  const handleCreateTournament = () => {
    if (!newTournament.name || !newTournament.description || !newTournament.startDate || !newTournament.endDate) {
      alert("Please fill in all required fields")
      return
    }

    const tournament: Tournament = {
      id: Date.now(),
      name: newTournament.name,
      description: newTournament.description,
      status: "Draft",
      participants: 0,
      maxParticipants: newTournament.maxParticipants,
      startDate: newTournament.startDate,
      endDate: newTournament.endDate,
      prize: newTournament.prize,
      category: newTournament.category,
      color: "#6B7280",
    }
    setTournaments([...tournaments, tournament])
    setNewTournament({
      name: "",
      description: "",
      category: "General",
      maxParticipants: 100,
      startDate: "",
      endDate: "",
      prize: "$250"
    })
    setIsCreateDialogOpen(false)
  }

  const handleViewTournament = (id: number) => {
    alert(`View tournament ${id} (This is a demo)`)
  }

  const handleEditTournament = (id: number) => {
    alert(`Edit tournament ${id} (This is a demo)`)
  }

  const handleDeleteTournament = (id: number) => {
    if (confirm("Are you sure you want to delete this tournament?")) {
      setTournaments(tournaments.filter(tournament => tournament.id !== id))
      alert("Tournament deleted!")
    }
  }

  const handleStartTournament = (id: number) => {
    setTournaments(tournaments.map(tournament => 
      tournament.id === id ? { ...tournament, status: "Active" } : tournament
    ))
    alert("Tournament started!")
  }

  const handlePauseTournament = (id: number) => {
    setTournaments(tournaments.map(tournament => 
      tournament.id === id ? { ...tournament, status: "Paused" } : tournament
    ))
    alert("Tournament paused!")
  }

  const handleEndTournament = (id: number) => {
    setTournaments(tournaments.map(tournament => 
      tournament.id === id ? { ...tournament, status: "Completed" } : tournament
    ))
    alert("Tournament ended!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tournaments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage competitive quiz tournaments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tournament-name">Tournament Name</Label>
                <Input
                  id="tournament-name"
                  value={newTournament.name}
                  onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                  placeholder="Enter tournament name"
                />
              </div>
              <div>
                <Label htmlFor="tournament-description">Description</Label>
                <Textarea
                  id="tournament-description"
                  value={newTournament.description}
                  onChange={(e) => setNewTournament({ ...newTournament, description: e.target.value })}
                  placeholder="Enter tournament description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tournament-category">Category</Label>
                <Select value={newTournament.category} onValueChange={(value) => setNewTournament({ ...newTournament, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tournament-participants">Max Participants</Label>
                <Select value={newTournament.maxParticipants.toString()} onValueChange={(value) => setNewTournament({ ...newTournament, maxParticipants: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="150">150</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tournament-start">Start Date</Label>
                  <Input
                    id="tournament-start"
                    type="date"
                    value={newTournament.startDate}
                    onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tournament-end">End Date</Label>
                  <Input
                    id="tournament-end"
                    type="date"
                    value={newTournament.endDate}
                    onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tournament-prize">Prize Pool</Label>
                <Select value={newTournament.prize} onValueChange={(value) => setNewTournament({ ...newTournament, prize: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prizeOptions.map((prize) => (
                      <SelectItem key={prize} value={prize}>
                        {prize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTournament}>
                  Create Tournament
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${tournament.color}15` }}
                  >
                    <Trophy className="h-6 w-6" style={{ color: tournament.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tournament.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tournament.category}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewTournament(tournament.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditTournament(tournament.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Tournament
                    </DropdownMenuItem>
                    {tournament.status === "Upcoming" && (
                      <DropdownMenuItem onClick={() => handleStartTournament(tournament.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Start Tournament
                      </DropdownMenuItem>
                    )}
                    {tournament.status === "Active" && (
                      <>
                        <DropdownMenuItem onClick={() => handlePauseTournament(tournament.id)}>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause Tournament
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEndTournament(tournament.id)}>
                          End Tournament
                        </DropdownMenuItem>
                      </>
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
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tournament.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Participants</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {tournament.participants}/{tournament.maxParticipants}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Prize Pool</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Award className="mr-1 h-4 w-4" />
                    {tournament.prize}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {tournament.startDate} - {tournament.endDate}
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
                  <Button variant="outline" size="sm" onClick={() => handleViewTournament(tournament.id)}>
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
