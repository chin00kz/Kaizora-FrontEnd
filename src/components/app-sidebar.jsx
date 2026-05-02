import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  MoreHorizontal,
  ClipboardCheck,
  Building,
  User,
  Info,
} from "lucide-react"

import { useAuth } from "../context/AuthContext"
import { cn } from "../lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "./ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

// Assets
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
    roles: ["employee", "qdm", "hod", "admin", "superadmin"],
  },
  {
    title: "My Profile",
    icon: User,
    url: "/profile",
    roles: ["employee", "qdm", "hod", "admin", "superadmin"],
  },
  {
    title: "My Kaizens",
    icon: FileText,
    url: "/my-kaizens",
    roles: ["employee", "qdm", "hod", "admin", "superadmin"],
  },
  {
    title: "QDM Portal",
    icon: ClipboardCheck,
    url: "/qdm-portal",
    roles: ["qdm", "admin", "superadmin"],
  },
  {
    title: "Department",
    icon: Building,
    url: "/department",
    roles: ["hod", "admin", "superadmin"],
  },
  {
    title: "User Management",
    icon: Users,
    url: "/management",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/analytics",
    roles: ["qdm", "hod", "admin", "superadmin"],
  },
  {
    title: "System Overview",
    icon: Settings,
    url: "/system-overview",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Nuclear Console",
    icon: ShieldCheck,
    url: "/superadmin-console",
    roles: ["admin", "superadmin"],
  },
  {
    title: "About",
    icon: Info,
    url: "/about",
    roles: ["employee", "qdm", "hod", "admin", "superadmin"],
  },
]

const roleLabels = {
  employee: "Employee",
  qdm: "QDM Team",
  hod: "Head of Dept",
  admin: "Admin",
  superadmin: "⚡ Super Admin",
}

export function AppSidebar({ ...props }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const { state } = useSidebar()

  const filteredItems = menuItems.filter(
    (item) => profile && item.roles.includes(profile.role)
  )

  const isSuperAdmin = profile?.role === 'superadmin'

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar" {...props}>
      <SidebarHeader className="h-24 flex flex-col justify-center px-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <img 
            src="/favicon.png" 
            alt="Kaizora" 
            className="w-10 h-10 object-contain rounded-lg shrink-0 shadow-sm" 
          />
          {state !== "collapsed" && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
              <span className={cn(
                "text-2xl font-black tracking-tighter italic leading-none",
                "bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
              )}>
                Kaizora.
              </span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-0.5 ml-0.5">
                by QDM
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-2">
        {/* Superadmin Mode Indicator */}
        {isSuperAdmin && state !== "collapsed" && (
          <div className="mx-2 mb-6 px-3 py-2 bg-white/10 border border-white/20 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#ff7e28] flex-shrink-0" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              Super Admin Mode
            </span>
          </div>
        )}

        <SidebarMenu className="gap-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.url
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "transition-all duration-200 py-6 px-4 rounded-xl relative",
                    isActive
                      ? "bg-[#ff7e28] text-white font-bold shadow-lg"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Link to={item.url}>
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full animate-in fade-in slide-in-from-left-1 duration-300" />
                    )}
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-white" : "text-white/50 group-hover:text-white"
                    )} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full data-[state=open]:bg-white/20 rounded-xl transition-colors bg-white/5 border border-white/10"
                >
                  <Avatar className="w-8 h-8 border border-white/20 shadow-sm">
                    <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profile?.email || 'user')}`} />
                    <AvatarFallback className={cn(
                      "font-bold text-xs uppercase",
                      profile?.role === 'superadmin' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                    )}>
                      {profile?.username?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {state !== "collapsed" && (
                    <div className="flex flex-1 flex-col items-start text-sm overflow-hidden animate-in fade-in duration-300">
                      <span className="text-[10px] uppercase font-bold tracking-tighter text-white/50 leading-none mb-1">
                        Logged in as
                      </span>
                      <span className="font-bold text-white truncate w-full leading-none">
                        {profile?.username || profile?.full_name}
                      </span>
                    </div>
                  )}
                  <MoreHorizontal className="ml-auto w-4 h-4 text-white/30" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={state === "collapsed" ? "right" : "top"}
                align="end"
                className="w-56 bg-white border-slate-200 text-slate-700 rounded-xl p-1 shadow-xl shadow-slate-200/50"
              >
                <DropdownMenuItem asChild className="focus:bg-slate-100 focus:text-slate-900 rounded-lg cursor-pointer">
                  <Link to="/profile" className="flex w-full">
                    <Settings className="mr-2 w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={signOut}
                  className="focus:bg-red-50 text-red-600 rounded-lg cursor-pointer"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
