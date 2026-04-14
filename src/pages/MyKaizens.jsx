import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function MyKaizens() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: kaizens, isLoading } = useQuery({
    queryKey: ["kaizens", "me"],
    queryFn: () => api.get("/kaizens").then((res) => res.data.data.kaizens),
  });

  const filteredKaizens = kaizens?.filter(k => 
    k.title?.toLowerCase().includes(search.toLowerCase()) ||
    k.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Industrial Insights</h1>
          <p className="text-slate-500 font-medium">Tracking your impact on the corporate ecosystem.</p>
        </div>
        
        <Button 
          onClick={() => navigate("/submit-kaizen")}
          className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Submission
        </Button>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">My Submissions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search ideas..." 
                className="pl-9 h-10 bg-white border-slate-200 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-8 font-bold text-slate-700 uppercase text-[10px] tracking-widest">Kaizen Info</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Category</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Impact</TableHead>
                <TableHead className="text-right px-8 font-bold text-slate-700 uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKaizens?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <FileText className="w-12 h-12 mb-2" />
                      <p className="text-lg font-bold">No submissions yet</p>
                      <p className="text-sm">Your ideas for improvement will appear here.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredKaizens?.map((kaizen) => (
                  <TableRow key={kaizen.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/kaizen/${kaizen.id}`)}>
                          {kaizen.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          Ref: #{kaizen.id.slice(0, 8).toUpperCase()} &bull; {new Date(kaizen.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded-lg font-bold px-2 py-0.5 text-[10px] uppercase tracking-tighter">
                        {kaizen.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${getStatusColor(kaizen.status)}`}>
                        {getStatusIcon(kaizen.status)}
                        {kaizen.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${getImpactStyles(kaizen.impact_level)}`}>
                        {kaizen.impact_level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="sm" className="h-9 font-bold text-primary hover:bg-primary/5" onClick={() => navigate(`/kaizen/${kaizen.id}`)}>
                        View Hub <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'approved': return 'text-green-600';
    case 'pending': return 'text-amber-600';
    case 'rejected': return 'text-red-600';
    default: return 'text-slate-500';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'approved': return <CheckCircle2 className="w-4 h-4" />;
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'rejected': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
}

function getImpactStyles(level) {
  switch (level) {
    case 'high': return 'bg-accent/10 text-accent border-accent/20';
    case 'medium': return 'bg-primary/10 text-primary border-primary/20';
    case 'low': return 'bg-slate-100 text-slate-500 border-slate-200';
    default: return '';
  }
}
