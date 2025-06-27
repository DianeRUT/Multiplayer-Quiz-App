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

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "Live Activity", url: "/live", icon: Activity },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/users", icon: Users },
      { title: "Questions", url: "/questions", icon: HelpCircle },
      { title: "Categories", url: "/categories", icon: Database },
      { title: "Tournaments", url: "/tournaments", icon: Trophy },
    ],
  },
  {
    title: "Moderation",
    items: [
      { title: "Reports", url: "/reports", icon: MessageSquare },
      { title: "Banned Users", url: "/banned", icon: Shield },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
]

export function AdminSidebar() {
  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b px-6 py-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Quiz Battle</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/50 dark:hover:text-teal-300 transition-colors"
                    >
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
