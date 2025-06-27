"use client"

import {
  Users,
  HelpCircle,
  BarChart3,
  Settings,
  Shield,
  Trophy,
  Activity,
  Home,
  MessageSquare,
  Database,
} from "lucide-react"
import { cn } from "../lib/utils"

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", key: "dashboard", icon: Home },
      { title: "Analytics", key: "analytics", icon: BarChart3 },
      { title: "Live Activity", key: "live", icon: Activity },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", key: "users", icon: Users },
      { title: "Questions", key: "questions", icon: HelpCircle },
      { title: "Categories", key: "categories", icon: Database },
      { title: "Tournaments", key: "tournaments", icon: Trophy },
    ],
  },
  {
    title: "Moderation",
    items: [
      { title: "Reports", key: "reports", icon: MessageSquare },
      { title: "Banned Users", key: "banned", icon: Shield },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", key: "settings", icon: Settings }],
  },
]

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6 border-b bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Quiz Battle</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-6">
        {navigationItems.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onPageChange(item.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                    "hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/50 dark:hover:text-teal-300",
                    currentPage === item.key
                      ? "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                      : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
