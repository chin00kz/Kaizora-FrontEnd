import React from 'react';
import { useSystemStatus } from '@/context/SystemStatusContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wrench, 
  LogOut, 
  RefreshCcw, 
  ShieldAlert, 
  Lock,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Maintenance() {
  const { status, refreshStatus, isLoading } = useSystemStatus();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    await refreshStatus();
    // If maintenance is over, the guard logic in App.jsx/ProtectedRoute will kick in 
    // Usually we just reload the window to be sure
    window.location.href = '/';
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        <Card className="border-0 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10 text-center space-y-8">
            {/* Status Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center border border-accent/20 rotate-3">
                  <Wrench className="w-10 h-10 text-accent -rotate-3" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
                  {status.maintenance_mode === 'superadmin-only' ? (
                    <Lock className="w-4 h-4 text-red-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-white tracking-tight">System Standby</h1>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-slate-300 font-medium leading-relaxed italic">
                  "{status.maintenance_message || "We're currently performing some critical adjustments to the system environment."}"
                </p>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                Tier: {status.maintenance_mode === 'superadmin-only' ? 'Critical Lockdown' : 'Admin Maintenance'}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="bg-transparent border-white/10 text-white hover:bg-white/10 h-12 rounded-xl"
              >
                <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white h-12 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe className="w-3 h-3" />
              Kaizora Global Infrastructure
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
