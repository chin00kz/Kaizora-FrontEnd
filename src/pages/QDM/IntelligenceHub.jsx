import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Building2, 
  Target,
  Loader2,
  Medal,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function IntelligenceHub() {
  const { data: overview, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: () => api.get("/analytics/overview").then((res) => res.data.data),
    staleTime: 15000, // 15 seconds middle-ground
    gcTime: 600000, // 10 minutes cache retention
    placeholderData: (previousData) => previousData, // Smooth transitions
  });

  if (isLoading && !overview) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#4c1d95]" />
      </div>
    );
  }

  const metrics = overview;
  const leaderboard = overview;


  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Innovation Index" 
          value={leaderboard?.users?.[0]?.innovationIndex || "0.0"} 
          label="Top Performer Score"
          icon={<Target className="w-5 h-5 text-emerald-500" />}
          trend="+12% from last month"
        />
        <MetricCard 
          title="Submission Volume" 
          value={metrics?.trends?.reduce((acc, curr) => acc + curr.submissions, 0) || 0} 
          label="Total active pipeline"
          icon={<Activity className="w-5 h-5 text-blue-500" />}
          trend="Real-time stream"
        />
        <MetricCard 
          title="Average Quality" 
          value={metrics?.trends?.[metrics.trends.length - 1]?.avgScore || "0.0"} 
          label="Recent evaluation avg"
          icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
          trend="Target: > 8.0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Leaderboard */}
        <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-700">Elite Innovators</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {leaderboard?.users?.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-[#4c1d95] text-white font-bold">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                <Medal className={`w-3 h-3 ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                            </div>
                        )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{user.count} Approved Kaizens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#4c1d95] text-sm">{user.innovationIndex}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">IDX SCORE</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Rankings */}
        <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#4c1d95]" />
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-700">Department Impact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {leaderboard?.departments?.map((dept) => (
                <div key={dept.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-tight">{dept.name}</p>
                    <span className="text-[10px] font-black text-[#4c1d95]">{dept.innovationIndex} pts</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#4c1d95] rounded-full" 
                        style={{ width: `${Math.min((dept.innovationIndex / 50) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submission Trend Chart */}
      <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-8">
            <CardTitle className="text-lg font-black text-slate-800">Innovation Velocity</CardTitle>
            <p className="text-sm text-slate-400 font-medium italic">Monthly submission volume vs quality index</p>
        </CardHeader>
        <CardContent className="h-[300px] px-4 pb-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics?.trends}>
              <defs>
                <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4c1d95" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4c1d95" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} 
              />
              <YAxis 
                hide 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="submissions" 
                stroke="#4c1d95" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSub)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, label, icon, trend }) {
  return (
    <Card className="border-0 shadow-xl rounded-3xl bg-white p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <div>
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
        </div>
        <div className="pt-2 border-t border-slate-50">
          <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
        </div>
      </div>
    </Card>
  );
}
