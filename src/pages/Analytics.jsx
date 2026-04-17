import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Loader2, TrendingUp, Users, Activity, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const { profile } = useAuth();
  
  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => api.get('/analytics/overview').then(res => res.data.data),
    staleTime: 15000,
    gcTime: 600000,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const statusPie = [
    { name: 'Approved', value: overview?.statusDistribution?.approved || 0, color: '#10b981' },
    { name: 'Pending', value: overview?.statusDistribution?.pending || 0, color: '#f59e0b' },
    { name: 'Rejected', value: overview?.statusDistribution?.rejected || 0, color: '#ef4444' }
  ].filter(d => d.value > 0);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Kaizora Analytics
          </h1>
          <p className="text-slate-500 font-medium">
            Deep insights into continuous improvement and workforce engagement.
          </p>
        </div>
      </div>

      {/* Top Level Metric Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total ROI Submissions" 
          value={overview?.totalSubmissions || 0} 
          icon={Activity} 
          trend="+12%" 
          color="primary" 
        />
        <MetricCard 
          title="Approval Rate" 
          value={overview?.totalSubmissions > 0 ? `${Math.round((overview?.statusDistribution?.approved / overview?.totalSubmissions) * 100)}%` : "0%"} 
          icon={CheckCircle2} 
          trend="Steady" 
          color="emerald" 
        />
        <MetricCard 
          title="Avg Review Time" 
          value={overview?.avgReviewTime || "-"} 
          icon={Clock} 
          color="amber" 
        />
        <MetricCard 
          title="Active Users" 
          value={overview?.totalUsers || "-"} 
          icon={Users} 
          color="violet" 
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Chart (Line) span 2 cols */}
        <Card className="lg:col-span-2 shadow-xl shadow-slate-200/40 border-slate-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Submission Trend
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              Monthly overview of ideas generated vs approved
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={overview?.trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                 <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                 <Line type="monotone" dataKey="submissions" name="Total Submissions" stroke="#0ea5e9" strokeWidth={4} dot={{r: 4}} activeDot={{r: 6}} />
                 <Line type="monotone" dataKey="approved" name="Approved Ideas" stroke="#10b981" strokeWidth={4} dot={{r: 4}} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution (Donut) span 1 col */}
        <Card className="shadow-xl shadow-slate-200/40 border-slate-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xl font-bold">Status Overview</CardTitle>
            <CardDescription className="font-medium text-slate-500">
              Current state of all Kaizens
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px] flex flex-col justify-center">
             <ResponsiveContainer width="100%" height="90%">
               <PieChart>
                 <Pie
                    data={statusPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                 >
                   {statusPie.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                 />
                 <Legend verticalAlign="bottom" height={36} iconType="circle"/>
               </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Impact (Bar) span 3 cols */}
        <Card className="lg:col-span-3 shadow-xl shadow-slate-200/40 border-slate-200 rounded-3xl overflow-hidden">
             <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-xl font-bold">Top Performing Departments</CardTitle>
               <CardDescription className="font-medium text-slate-500">
                 Highest innovation density across the enterprise
               </CardDescription>
             </CardHeader>
             <CardContent className="p-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview?.departments} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} />
                    <RechartsTooltip 
                       cursor={{fill: '#f1f5f9'}}
                       contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="innovationIndex" name="Innovation Index" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                      {overview?.departments?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </CardContent>
        </Card>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200",
    violet: "bg-violet-100 text-violet-600 border-violet-200"
  };

  return (
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200 rounded-3xl overflow-hidden transition-all hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
