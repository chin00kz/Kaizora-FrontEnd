import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Database, 
  Zap, 
  Users, 
  FileText, 
  Building, 
  CheckCircle2, 
  ShieldCheck,
  Globe,
  Terminal,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

export default function AdminOverview() {
  const { profile } = useAuth();
  
  // Queries
  const { data: usersData, isPending: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data.data.profiles),
  });

  const { data: kaizens, isPending: loadingKaizens } = useQuery({
    queryKey: ["kaizens"],
    queryFn: () => api.get("/kaizens").then((res) => res.data.data.kaizens),
  });

  const { data: deptsData, isPending: loadingDepts } = useQuery({
    queryKey: ["departments"],
    queryFn: () => api.get("/departments").then((res) => res.data.data.departments),
  });

  const { data: healthResult, isPending: loadingHealth } = useQuery({
    queryKey: ["system-health-detailed"],
    queryFn: async () => {
      const start = performance.now();
      const res = await api.get("health");
      const end = performance.now();
      return {
        ...res.data,
        latency: Math.round(end - start)
      };
    },
    refetchInterval: 10000, // Check every 10s
  });

  // Process data
  const stats = useMemo(() => {
    if (!usersData || !kaizens || !deptsData) return null;
    return {
      totalUsers: usersData.length,
      totalKaizens: kaizens.length,
      totalDepts: deptsData.length,
      pendingApproval: usersData.filter(u => !u.is_approved).length,
      admins: usersData.filter(u => ['admin', 'superadmin'].includes(u.role)),
      isStable: healthResult?.status === 'OK'
    };
  }, [usersData, kaizens, deptsData, healthResult]);

  // Only show the full-page loader if we haven't computed our stats yet
  if (!stats) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const formatUptime = (seconds) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <TooltipProvider>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
            </div>
            <p className="text-slate-500 font-medium">Enterprise health monitoring and activity metrics.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 cursor-help">
                  <div className={`w-2 h-2 rounded-full ${stats.isStable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                    API: {healthResult?.latency || 0}ms
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>Service Response Speed</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 cursor-help">
                  <div className={`w-2 h-2 rounded-full ${stats.isStable ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                    Uptime: {formatUptime(healthResult?.uptime)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>Current Process Life</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      {/* Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PulseCard title="Total Identities" value={stats.totalUsers} icon={Users} color="bg-primary/10 text-primary" detail={`${stats.pendingApproval} Pending`} />
        <PulseCard title="Idea Pipeline" value={stats.totalKaizens} icon={FileText} color="bg-accent/10 text-accent" detail="System Wide" />
        <PulseCard title="Organization" value={stats.totalDepts} icon={Building} color="bg-emerald-100 text-emerald-600" detail="Active Nodes" />
        <PulseCard title="Performance" value={stats.isStable ? "Stable" : "Degraded"} icon={CheckCircle2} color={stats.isStable ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"} detail={healthResult?.latency < 100 ? "Optimal" : "High Latency"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Administrative Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-8">Identity</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right px-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="px-8 font-bold text-slate-900 flex items-center gap-2">
                      {admin.full_name}
                      {admin.id === profile?.id && (
                        <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-0 text-[9px] h-4">YOU</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-0 rounded-lg uppercase text-[10px]">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right px-8 font-bold text-xs ${admin.is_approved ? 'text-green-600' : 'text-amber-600'}`}>
                      {admin.is_approved ? 'ACTIVE' : 'PENDING'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-[2rem] p-8 space-y-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Environment Info</h4>
          <div className="space-y-4">
            <InfoRow icon={Terminal} label="Runtime" value={`Node ${healthResult?.nodeVersion || 'v20.x'}`} />
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Environment</span>
              <span className="text-xs font-bold text-slate-400 uppercase">{healthResult?.env || 'development'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Region</span>
              <span className="text-xs font-bold text-slate-400">{healthResult?.env === 'development' ? 'Localhost' : 'Cloud-Edge'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PulseCard({ title, value, icon: Icon, color, detail }) {
  return (
    <Card className="border-slate-200 shadow-xl rounded-[2rem] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{detail}</span>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        <p className="text-xs font-bold text-slate-500 mt-1 uppercase">{title}</p>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <span className="text-xs font-bold text-slate-400">{value}</span>
    </div>
  );
}
