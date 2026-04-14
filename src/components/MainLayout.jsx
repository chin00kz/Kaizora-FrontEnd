import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Sidebar />
      
      <main className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search Kaizens, users..." 
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <div className="text-right">
              <p className="text-xs font-medium text-white">{profile?.full_name}</p>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-bold">{profile?.role}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
