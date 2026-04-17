import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldAlert, 
  Settings2, 
  Trash2, 
  Lock, 
  Unlock, 
  Zap, 
  Megaphone,
  Loader2,
  RefreshCcw,
  MessageSquareQuote,
  ShieldCheck,
  UserCog,
  Terminal,
  Activity as ActivityIcon,
  Trash2 as TrashIcon,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemStatus } from "@/context/SystemStatusContext";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SuperAdminConsole() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { status, refreshStatus } = useSystemStatus();
  const [maintenanceMessage, setMaintenanceMessage] = useState(status.maintenance_message);

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (data) => api.patch("/system/settings", data),
    onSuccess: () => {
      toast({ title: "Settings Updated", description: "Global system state has been modified." });
      queryClient.invalidateQueries(["system-status"]);
      refreshStatus();
    },
    onError: (err) => toast({ title: "Update Failed", description: err.response?.data?.message || err.message, variant: "destructive" }),
  });

  const purgeMutation = useMutation({
    mutationFn: () => api.delete("/system/nuclear/purge-rejected"),
    onSuccess: () => {
      toast({ title: "Nuclear Purge Complete", description: "All rejected Kaizens have been permanently deleted." });
      queryClient.invalidateQueries(["kaizens"]);
    },
    onError: (err) => toast({ title: "Purge Failed", description: err.message, variant: "destructive" }),
  });

  const broadcastMutation = useMutation({
    mutationFn: (data) => api.post("/users/broadcast", data),
    onSuccess: () => {
      toast({ title: "Broadcast Dispatched", description: "Global notification sent successfully." });
    },
  });

  const { data: logsData, isLoading: loadingLogs } = useQuery({
    queryKey: ["system-logs"],
    queryFn: () => api.get("/system/logs").then((res) => res.data.data.logs),
    enabled: status.api_debug_mode === true || status.api_debug_mode === 'true',
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const clearLogsMutation = useMutation({
    mutationFn: () => api.delete("/system/logs"),
    onSuccess: () => {
      toast({ title: "Logs Cleared", description: "History has been wiped." });
      queryClient.invalidateQueries(["system-logs"]);
    },
  });

  const handleMaintenanceToggle = (mode) => {
    updateSettingsMutation.mutate({ mode });
  };

  const handleDebugToggle = () => {
    const nextMode = !(status.api_debug_mode === true || status.api_debug_mode === 'true');
    updateSettingsMutation.mutate({ debug_mode: nextMode });
  };

  const handleUpdateMessage = () => {
    updateSettingsMutation.mutate({ message: maintenanceMessage });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
              <Zap className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">NUCLEAR CONSOLE</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] pl-1">Authorized Superadmin Usage Only</p>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span className="text-sm font-black text-red-600 uppercase tracking-widest">High Stakes Environment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Tiered Maintenance Module */}
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 p-10 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <RefreshCcw className="w-6 h-6 text-primary" />
                  Sovereign Maintenance
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium mt-1">Tiered restriction controls for platform stability.</CardDescription>
              </div>
              <Badge className={`rounded-lg uppercase px-3 py-1 ${status.maintenance_mode === 'none' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {status.maintenance_mode === 'none' ? 'Live' : 'Locked'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            {/* Mode Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModeButton 
                active={status.maintenance_mode === 'none'} 
                title="Active" 
                detail="All users OK" 
                icon={Unlock} 
                color="bg-green-500"
                onClick={() => handleMaintenanceToggle('none')}
              />
              <ModeButton 
                active={status.maintenance_mode === 'admin-only'} 
                title="Admin-Only" 
                detail="Employees blocked" 
                icon={ShieldCheck} 
                color="bg-amber-500"
                onClick={() => handleMaintenanceToggle('admin-only')}
              />
              <ModeButton 
                active={status.maintenance_mode === 'superadmin-only'} 
                title="Lockdown" 
                detail="Power users only" 
                icon={Lock} 
                color="bg-red-600"
                onClick={() => handleMaintenanceToggle('superadmin-only')}
              />
            </div>

            {/* Message Config */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm px-1">
                <MessageSquareQuote className="w-4 h-4" />
                Standby Message
              </div>
              <div className="flex gap-3">
                <Input 
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Set custom standby text..."
                  className="rounded-xl h-12 bg-slate-50 border-slate-100 focus:ring-accent"
                />
                <Button 
                  onClick={handleUpdateMessage}
                  disabled={updateSettingsMutation.isLoading}
                  className="rounded-xl px-8 h-12 bg-slate-900 hover:bg-black font-bold"
                >
                  {updateSettingsMutation.isLoading ? <Loader2 className="animate-spin" /> : "Set"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nuclear Actions Module */}
        <div className="space-y-8">
          <Card className="border-0 shadow-2xl shadow-red-200/20 rounded-[2.5rem] overflow-hidden bg-slate-900 text-white">
            <CardHeader className="p-10 pb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Nuclear Cleanup</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Permanent data destruction actions.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-6">
              <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-red-100">Purge Rejected Kaizens</h4>
                  <p className="text-xs text-red-500/60 font-medium">This will permanently delete all submissions marked as "Rejected" across the entire enterprise.</p>
                </div>
                <SlideToExecute 
                  onExecute={() => purgeMutation.mutate()} 
                  isExecuting={purgeMutation.isLoading} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Admin Toggles */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-10 bg-white space-y-6">
            <div className="flex items-center gap-3">
              <UserCog className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-slate-900">Privilege Management</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium">Admin promotion and security overrides should be managed carefully via the <span className="font-bold text-slate-900 uppercase">User Management</span> tab with your Superadmin bypass active.</p>
            
            <div className="pt-6 border-t border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">API Debug Mode</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {status.api_debug_mode === true || status.api_debug_mode === 'true' ? 'Logging Active' : 'Restricted'}
                  </p>
                </div>
                <button 
                  onClick={handleDebugToggle}
                  className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${
                    status.api_debug_mode === true || status.api_debug_mode === 'true' ? 'bg-accent' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                    status.api_debug_mode === true || status.api_debug_mode === 'true' ? 'ml-auto' : ''
                  }`} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Live Logger Terminal */}
      {(status.api_debug_mode === true || status.api_debug_mode === 'true') && (
        <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-950 text-emerald-400 font-mono text-xs animate-in slide-in-from-top-4 duration-500">
          <CardHeader className="bg-slate-900/50 p-6 flex flex-row items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
              </div>
              <div className="h-4 w-[1px] bg-white/10 mx-2" />
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-bold tracking-widest uppercase text-[10px] text-slate-400">Live System Activity Stream</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => clearLogsMutation.mutate()}
              className="hover:bg-red-500/10 hover:text-red-400 text-slate-500 h-8 rounded-lg"
            >
              <TrashIcon className="w-3 h-3 mr-2" />
              Clear Console
            </Button>
          </CardHeader>
          <CardContent className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-1.5">
              {!logsData || logsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-700">
                  <ActivityIcon className="w-8 h-8 mb-4 opacity-20" />
                  <p className="italic">Waiting for system packets...</p>
                </div>
              ) : (
                logsData.map((log) => (
                  <div key={log.id} className="flex gap-4 group hover:bg-white/5 p-1 rounded transition-colors">
                    <span className="text-slate-600 shrink-0">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                    <span className={`font-black w-10 uppercase ${
                      log.method === 'GET' ? 'text-blue-400' : 
                      log.method === 'POST' ? 'text-emerald-400' : 
                      log.method === 'PATCH' ? 'text-amber-400' : 'text-red-400'
                    }`}>{log.method}</span>
                    <span className="text-slate-300 truncate max-w-[300px]">{log.path}</span>
                    <span className={`font-bold ml-auto ${
                      log.status >= 400 ? 'text-red-500' : 
                      log.status >= 300 ? 'text-slate-500' : 'text-emerald-500'
                    }`}>{log.status}</span>
                    <span className="text-slate-600 hidden md:inline ml-4 italic truncate">by {log.user_name}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <div className="bg-slate-900 border-t border-white/5 p-3 px-6 flex items-center justify-between">
             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Stream Connected
             </div>
             <span className="text-[10px] text-slate-600">Buffer: {logsData?.length || 0}/50 Packets</span>
          </div>
        </Card>
      )}
    </div>
  );
}

function ModeButton({ active, title, detail, icon: Icon, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 group relative overflow-hidden ${
        active ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        active ? `${color} text-white shadow-lg` : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className={`font-black tracking-tight text-sm ${active ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{detail}</p>
      </div>
      {active && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary" />}
    </button>
  );
}

function SlideToExecute({ onExecute, isExecuting }) {
  const [progress, setProgress] = useState(0);

  const handleRelease = () => {
    if (progress > 95) {
      onExecute();
    }
    setTimeout(() => setProgress(0), 100);
  };

  if (isExecuting) {
    return (
      <div className="w-full md:w-[280px] h-14 bg-red-950/40 rounded-xl border border-red-500/30 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[280px] h-14 bg-red-950/40 rounded-xl overflow-hidden border border-red-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] shrink-0">
      <div 
        className="absolute top-0 left-0 h-full bg-red-600"
        style={{ width: `${progress}%` }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 font-bold text-xs tracking-[0.2em] uppercase text-red-100 drop-shadow-md transition-opacity">
        {progress > 85 ? "Release to purge" : "Slide to execute"}
      </div>

      <input 
        type="range" 
        min="0" max="100" 
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20 m-0"
      />

      <div 
        className="absolute top-1 bottom-1 w-12 bg-white rounded-xl shadow-lg pointer-events-none z-10 flex items-center justify-center transition-transform active:scale-95"
        style={{ 
          left: `${progress}%`, 
          transform: `translateX(calc(-${progress}% + ${progress === 0 ? '4px' : progress >= 100 ? '-4px' : '0px'}))` 
        }}
      >
        <div className="flex gap-1 opacity-50">
          <div className="w-[3px] h-5 bg-slate-800 rounded-full" />
          <div className="w-[3px] h-5 bg-slate-800 rounded-full" />
          <div className="w-[3px] h-5 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
