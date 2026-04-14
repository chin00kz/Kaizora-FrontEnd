import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils'; // I'll create this utility helper next

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      roles: ['employee', 'management', 'admin']
    },
    { 
      title: 'My Kaizens', 
      icon: FileText, 
      path: '/my-kaizens',
      roles: ['employee', 'management', 'admin']
    },
    { 
      title: 'Management', 
      icon: Users, 
      path: '/management',
      roles: ['management', 'admin']
    },
    { 
      title: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics',
      roles: ['management', 'admin']
    },
    { 
      title: 'Admin Settings', 
      icon: Settings, 
      path: '/admin',
      roles: ['admin']
    },
  ];

  const filteredItems = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <aside className="w-64 h-screen bg-[#1e293b] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl uppercase">K</span>
          </div>
          <span className="text-xl font-bold text-white tracking-widest">KAIZORA</span>
        </div>

        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400")} />
                  <span className="font-medium">{item.title}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5 space-y-4">
        {profile && (
          <div className="px-4 py-3 bg-slate-800/50 rounded-xl flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 uppercase text-xs">
              {profile.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{profile.full_name}</p>
              <p className="text-xs text-slate-500 capitalize">{profile.role}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium group"
        >
          <LogOut className="w-5 h-5 text-red-500/70 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
