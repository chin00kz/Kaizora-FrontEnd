import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Building,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const { data: kaizens, isLoading } = useQuery({
    queryKey: ["kaizens"],
    queryFn: () => api.get("/kaizens").then((res) => res.data.data.kaizens),
  });

  const stats = {
    total: kaizens?.length || 0,
    approved: kaizens?.filter(k => k.status === 'approved').length || 0,
    pending: kaizens?.filter(k => k.status === 'pending').length || 0,
    rejected: kaizens?.filter(k => k.status === 'rejected').length || 0,
  };

  const isStaff = profile?.role === 'employee';
  const isAdmin = ['admin', 'superadmin'].includes(profile?.role);
  const isQDM = profile?.role === 'qdm';
  const isHOD = profile?.role === 'hod';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-primary italic">{profile?.username || profile?.full_name}</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {isAdmin ? "System-wide performance overview." : "Your personal continuous improvement hub."}
          </p>
        </div>
        
        {isStaff && (
          <Button 
            onClick={() => navigate("/submit-kaizen")}
            className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Submit New Kaizen
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Kaizens" 
          value={stats.total} 
          icon={FileText} 
          color="bg-primary/10 text-primary" 
          label={isAdmin ? "System wide" : "My Submissions"}
        />
        <StatCard 
          title="Verified" 
          value={stats.approved} 
          icon={CheckCircle2} 
          color="bg-green-100 text-green-600" 
          label="Approved Ideas"
        />
        <StatCard 
          title="In Review" 
          value={stats.pending} 
          icon={Clock} 
          color="bg-amber-100 text-amber-600" 
          label="Pending QDM"
        />
        <StatCard 
          title="Impact" 
          value="High" 
          icon={TrendingUp} 
          color="bg-accent/10 text-accent" 
          label="Projected Savings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Feed */}
        <Card className="lg:col-span-2 border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Recent Stream</CardTitle>
              <p className="text-sm text-slate-500 font-medium">Latest updates from your environment.</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400">Loading activity...</div>
            ) : kaizens?.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 font-medium italic">No recent activity found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {kaizens?.slice(0, 5).map((kaizen) => (
                  <div key={kaizen.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{kaizen.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{kaizen.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {new Date(kaizen.created_at).toLocaleDateString()}
                        </span>
                        <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyles(kaizen.status)}`}>
                          {kaizen.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Specific Shortcuts */}
        <div className="space-y-6">
          {isAdmin && (
            <Card className="bg-slate-900 text-white border-0 shadow-2xl shadow-slate-900/40 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black tracking-tight">Admin Hub</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <Button 
                  onClick={() => navigate("/management")}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/10 justify-start h-12 rounded-xl"
                >
                  <Users className="w-4 h-4 mr-3" /> User Identities
                </Button>
                <Button 
                  onClick={() => navigate("/department")}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/10 justify-start h-12 rounded-xl"
                >
                  <Building className="w-4 h-4 mr-3" /> Departments
                </Button>
              </CardContent>
            </Card>
          )}

          {isQDM && (
            <Card className="bg-primary text-white border-0 shadow-2xl shadow-primary/40 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black tracking-tight font-bold">QDM Portal</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-primary-foreground/70 text-sm mb-6 leading-relaxed">
                  You have <span className="font-bold text-white">{stats.pending}</span> Kaizens awaiting your professional review.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 rounded-xl shadow-lg">
                  Open Review Suite
                </Button>
              </CardContent>
            </Card>
          )}

          {isHOD && (
            <Card className="bg-accent text-white border-0 shadow-2xl shadow-accent/40 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black tracking-tight font-bold">Dept Health</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  Reviewing performance for <span className="font-bold text-white underline decoration-white/30 decoration-2 underline-offset-4">{profile?.departments?.name || "assigned"}</span> department.
                </p>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold h-12 rounded-xl">
                  Manage Department
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Insights</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 leading-none">System Stability: 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                <span className="text-sm font-medium text-slate-700 leading-none">Active Staff: {stats.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, label }) {
  return (
    <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden hover:scale-[1.02] transition-transform">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">{title}</p>
      </CardContent>
    </Card>
  );
}

function getStatusStyles(status) {
  switch (status) {
    case 'approved': return 'bg-green-50 text-green-600 border-green-200';
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'rejected': return 'bg-red-50 text-red-600 border-red-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}
