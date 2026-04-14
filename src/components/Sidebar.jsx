import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['employee', 'management', 'admin', 'superadmin'],
  },
  {
    title: 'My Kaizens',
    icon: FileText,
    path: '/my-kaizens',
    roles: ['employee', 'management', 'admin', 'superadmin'],
  },
  {
    title: 'Management',
    icon: Users,
    path: '/management',
    roles: ['management', 'admin', 'superadmin'],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    roles: ['management', 'admin', 'superadmin'],
  },
  {
    title: 'Admin Panel',
    icon: Settings,
    path: '/admin',
    roles: ['admin', 'superadmin'],
  },
  {
    title: 'Super Admin',
    icon: ShieldCheck,
    path: '/superadmin',
    roles: ['superadmin'],
  },
];

const roleColors = {
  employee: 'text-slate-400',
  management: 'text-blue-400',
  admin: 'text-purple-400',
  superadmin: 'text-amber-400',
};

const roleBadge = {
  employee: 'Employee',
  management: 'Management',
  admin: 'Admin',
  superadmin: '⚡ Super Admin',
};

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const filteredItems = menuItems.filter(
    (item) => profile && item.roles.includes(profile.role)
  );

  return (
    <aside className="w-64 h-screen bg-[#1e293b] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-xl font-bold text-white tracking-widest">KAIZORA</span>
        </div>

        {/* Superadmin badge banner */}
        {profile?.role === 'superadmin' && (
          <div className="mb-6 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs text-amber-400 font-semibold">Super Admin Mode</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isSuperAdminRoute = item.path === '/superadmin';

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl transition-all group',
                  isActive
                    ? isSuperAdminRoute
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-blue-600/10 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive
                        ? isSuperAdminRoute ? 'text-amber-400' : 'text-blue-400'
                        : 'text-slate-500 group-hover:text-slate-400'
                    )}
                  />
                  <span className="font-medium">{item.title}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info + logout */}
      <div className="p-4 border-t border-white/5">
        {profile && (
          <div className="px-4 py-3 bg-slate-800/50 rounded-xl flex items-center gap-3 mb-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center font-bold border text-xs uppercase flex-shrink-0',
              profile.role === 'superadmin'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/20'
            )}>
              {profile.username?.charAt(0) || profile.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {profile.username || profile.full_name}
              </p>
              <p className={cn('text-xs font-semibold', roleColors[profile.role] || 'text-slate-500')}>
                {roleBadge[profile.role] || profile.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium group"
        >
          <LogOut className="w-5 h-5 text-red-500/70 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
