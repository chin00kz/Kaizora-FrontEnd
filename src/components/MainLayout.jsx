import { AppSidebar } from "./app-sidebar"
import { useAuth } from "../context/AuthContext"
import { Bell } from "lucide-react"
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "./ui/sidebar"
import { Separator } from "./ui/separator"
import { cn } from "../lib/utils"

const MainLayout = ({ children }) => {
  const { profile } = useAuth()
  const isSuperAdmin = profile?.role === 'superadmin'

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full bg-slate-50 transition-all duration-500">
        <AppSidebar />
        
        <SidebarInset className="flex flex-col bg-background flex-1 overflow-hidden relative">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[#ff7e28]/20 bg-white/70 backdrop-blur-md z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-[#ff7e28] hover:bg-[#ff7e28]/10 transition-all rounded-lg" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-slate-200" />
            </div>

            <div className="flex items-center gap-6">
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-[#ff7e28] hover:bg-[#ff7e28]/10 transition-all rounded-xl group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ff7e28] rounded-full border-2 border-white shadow-sm"></span>
              </button>

              <div className="flex items-center gap-4 pl-2 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                    {profile?.full_name}
                  </p>
                  <p className={cn(
                    "text-[10px] tracking-widest uppercase font-black",
                    isSuperAdmin ? "text-[#ff7e28]" : "text-[#4d148c]"
                  )}>
                    {profile?.role}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6 md:p-8 flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default MainLayout
