import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  BarChart3,
  Activity,
  FolderOpen,
  Trophy,
  FileText,
  UserX,
  Settings,
  BookOpen,
  Swords,
  Bell,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Questions", href: "/questions", icon: HelpCircle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Live Activity", href: "/live", icon: Activity },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "Quizzes", href: "/quizzes", icon: BookOpen },
  { name: "Tournaments", href: "/tournaments", icon: Trophy },
  { name: "Battles", href: "/battles", icon: Swords },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Banned Users", href: "/banned", icon: UserX },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Quiz Battle</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                  isActive
                    ? "bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
