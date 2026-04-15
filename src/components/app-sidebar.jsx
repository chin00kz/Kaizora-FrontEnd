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
import logo from "../assets/logo.jpg"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
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
    title: "Admin Panel",
    icon: Settings,
    url: "/admin",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Super Admin",
    icon: ShieldCheck,
    url: "/superadmin",
    roles: ["superadmin"],
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
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-[#f8fafc]" {...props}>
      <SidebarHeader className="h-20 flex items-center px-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FedEx Advantis" className="w-8 h-8 object-contain rounded-md" />
          {state !== "collapsed" && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-sm font-black text-primary tracking-tight leading-none">
                ADVANTIS
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-tighter uppercase">
                EXPRESS
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-2">
        {/* Superadmin Mode Indicator */}
        {isSuperAdmin && state !== "collapsed" && (
          <div className="mx-2 mb-6 px-3 py-2 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
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
                    "transition-all duration-200 py-6 px-4 rounded-xl",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                      : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                  )}
                >
                  <Link to={item.url}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full data-[state=open]:bg-slate-200 rounded-xl transition-colors bg-white/50 border border-slate-100"
                >
                  <Avatar className="w-8 h-8 border border-slate-200 shadow-sm">
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
                      <span className="font-semibold text-slate-900 truncate w-full leading-none mb-1">
                        {profile?.username || profile?.full_name}
                      </span>
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-tighter",
                        profile?.role === 'superadmin' ? "text-accent" : "text-primary"
                      )}>
                        {roleLabels[profile?.role] || profile?.role}
                      </span>
                    </div>
                  )}
                  <MoreHorizontal className="ml-auto w-4 h-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={state === "collapsed" ? "right" : "top"}
                align="end"
                className="w-56 bg-white border-slate-200 text-slate-700 rounded-xl p-1 shadow-xl shadow-slate-200/50"
              >
                <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 rounded-lg cursor-pointer">
                  <Settings className="mr-2 w-4 h-4" />
                  <span>Profile Settings</span>
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
