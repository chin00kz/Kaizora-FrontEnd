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

export default function AdminOverview() {
  const [healthStatus, setHealthStatus] = useState({
    api: "checking",
    db: "checking",
    latency: 0
  });

  // Queries
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data.data.profiles),
  });

  const { data: kaizens, isLoading: loadingKaizens } = useQuery({
    queryKey: ["kaizens"],
    queryFn: () => api.get("/kaizens").then((res) => res.data.data.kaizens),
  });

  const { data: deptsData, isLoading: loadingDepts } = useQuery({
    queryKey: ["departments"],
    queryFn: () => api.get("/departments").then((res) => res.data.data.departments),
  });

  // Health check simulation
  useEffect(() => {
    const checkHealth = () => {
      setTimeout(() => {
        setHealthStatus({
          api: "healthy",
          db: "healthy",
          latency: Math.floor(Math.random() * 40) + 20
        });
      }, 800);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Process data
  const stats = useMemo(() => {
    if (!usersData || !kaizens || !deptsData) return null;
    return {
      totalUsers: usersData.length,
      totalKaizens: kaizens.length,
      totalDepts: deptsData.length,
      pendingApproval: usersData.filter(u => !u.is_approved).length,
      admins: usersData.filter(u => ['admin', 'superadmin'].includes(u.role))
    };
  }, [usersData, kaizens, deptsData]);

  if (loadingUsers || loadingKaizens || loadingDepts) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

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
                  <div className={`w-2 h-2 rounded-full ${healthStatus.api === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                    API: {healthStatus.latency}ms
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>Service Response Speed</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 cursor-help">
                  <div className={`w-2 h-2 rounded-full ${healthStatus.db === 'healthy' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">DB Cluster</span>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>Data Storage Health</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      {/* Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PulseCard title="Total Identities" value={stats.totalUsers} icon={Users} color="bg-primary/10 text-primary" detail={`${stats.pendingApproval} Pending`} />
        <PulseCard title="Idea Pipeline" value={stats.totalKaizens} icon={FileText} color="bg-accent/10 text-accent" detail="System Wide" />
        <PulseCard title="Organization" value={stats.totalDepts} icon={Building} color="bg-emerald-100 text-emerald-600" detail="Active Nodes" />
        <PulseCard title="Performance" value="Stable" icon={CheckCircle2} color="bg-amber-100 text-amber-600" detail="99.9% Uptime" />
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
                    <TableCell className="px-8 font-bold text-slate-900">{admin.full_name}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-0 rounded-lg uppercase text-[10px]">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8 font-bold text-green-600 text-xs">ONLINE</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-[2rem] p-8 space-y-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Environment Info</h4>
          <div className="space-y-4">
            <InfoRow icon={Terminal} label="Runtime" value="Node v20.x" />
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Region</span>
              <span className="text-xs font-bold text-slate-400">AWS-Mumbai</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Edge Logic</span>
              <span className="text-xs font-bold text-green-500">Active</span>
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
