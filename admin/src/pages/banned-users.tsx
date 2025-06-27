import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Unlock, Eye, Trash2, AlertTriangle, Clock, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BannedUser {
  id: number
  name: string
  email: string
  reason: string
  bannedBy: string
  bannedAt: string
  expiresAt: string | null
  avatar: string
  previousWarnings: number
}

const initialBannedUsers: BannedUser[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    reason: "Inappropriate behavior in chat",
    bannedBy: "Admin",
    bannedAt: "2024-01-15",
    expiresAt: "2024-02-15",
    avatar: "/placeholder.svg?height=40&width=40",
    previousWarnings: 2,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    reason: "Cheating in tournaments",
    bannedBy: "Moderator",
    bannedAt: "2024-01-10",
    expiresAt: null,
    avatar: "/placeholder.svg?height=40&width=40",
    previousWarnings: 1,
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.w@example.com",
    reason: "Spam and harassment",
    bannedBy: "Admin",
    bannedAt: "2024-01-08",
    expiresAt: "2024-01-22",
    avatar: "/placeholder.svg?height=40&width=40",
    previousWarnings: 3,
  },
  {
    id: 4,
    name: "Lisa Brown",
    email: "lisa.b@example.com",
    reason: "Creating multiple accounts",
    bannedBy: "System",
    bannedAt: "2024-01-05",
    expiresAt: null,
    avatar: "/placeholder.svg?height=40&width=40",
    previousWarnings: 0,
  },
]

export function BannedUsers() {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>(initialBannedUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = bannedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUnbanUser = (id: number) => {
    if (confirm("Are you sure you want to unban this user?")) {
      setBannedUsers(bannedUsers.filter(user => user.id !== id))
      alert("User unbanned successfully!")
    }
  }

  const handleViewDetails = (id: number) => {
    const user = bannedUsers.find(u => u.id === id)
    alert(`Viewing details for ${user?.name} (This is a demo)`)
  }

  const handleDeleteUser = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      setBannedUsers(bannedUsers.filter(user => user.id !== id))
      alert("User permanently deleted!")
    }
  }

  const handleExtendBan = (id: number) => {
    const user = bannedUsers.find(u => u.id === id)
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    setBannedUsers(bannedUsers.map(u => 
      u.id === id ? { ...u, expiresAt: newExpiry } : u
    ))
    alert(`Ban extended for ${user?.name} until ${newExpiry}`)
  }

  const isBanExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getBanStatus = (user: BannedUser) => {
    if (!user.expiresAt) return "Permanent"
    if (isBanExpired(user.expiresAt)) return "Expired"
    return "Temporary"
  }

  const getBanStatusColor = (user: BannedUser) => {
    const status = getBanStatus(user)
    switch (status) {
      case "Permanent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Temporary":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banned Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage banned users and moderation actions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {bannedUsers.length} Banned Users
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search banned users..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Banned by {user.bannedBy} on {user.bannedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={getBanStatusColor(user)}
                    >
                      {getBanStatus(user)}
                    </Badge>
                    {user.expiresAt && !isBanExpired(user.expiresAt) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Expires: {user.expiresAt}
                      </p>
                    )}
                    {user.previousWarnings > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.previousWarnings} previous warnings
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    <p className="font-medium">Reason:</p>
                    <p>{user.reason}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-green-600"
                        onClick={() => handleUnbanUser(user.id)}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Unban User
                      </DropdownMenuItem>
                      {user.expiresAt && !isBanExpired(user.expiresAt) && (
                        <DropdownMenuItem onClick={() => handleExtendBan(user.id)}>
                          <Clock className="mr-2 h-4 w-4" />
                          Extend Ban
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No banned users found matching your search." : "No banned users found."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Banned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bannedUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Temporary Bans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bannedUsers.filter(u => u.expiresAt && !isBanExpired(u.expiresAt)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Permanent Bans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bannedUsers.filter(u => !u.expiresAt).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
