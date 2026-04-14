import { AppSidebar } from "./app-sidebar"
import { useAuth } from "../context/AuthContext"
import { Bell, Search } from "lucide-react"
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
      <div className="flex min-h-screen w-full bg-slate-50 transition-all duration-500">
        <AppSidebar />
        
        <SidebarInset className="flex flex-col bg-background overflow-hidden relative">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-primary transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              
              {/* Clean search bar */}
              <div className="relative w-64 md:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Kaizens, people..." 
                  className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-primary transition-all hover:bg-slate-100 rounded-xl group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-4 pl-2 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none mb-1">
                    {profile?.full_name}
                  </p>
                  <p className={cn(
                    "text-[10px] tracking-widest uppercase font-bold",
                    isSuperAdmin ? "text-accent" : "text-primary"
                  )}>
                    {profile?.role}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6 md:p-8 flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default MainLayout
