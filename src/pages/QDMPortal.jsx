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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ExternalLink,
  BarChart3,
  Download,
  Inbox,
  Trophy,
  PieChart as PieChartIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntelligenceHub from "./QDM/IntelligenceHub";
import ReportForge from "./QDM/ReportForge";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function QDMPortal() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: kaizens, isLoading } = useQuery({
    queryKey: ["kaizens"],
    queryFn: () => api.get("/kaizens").then((res) => res.data.data.kaizens),
  });

  const filteredKaizens = kaizens?.filter(k => 
    k.title?.toLowerCase().includes(search.toLowerCase()) ||
    k.category?.toLowerCase().includes(search.toLowerCase()) ||
    k.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-black text-[#4c1d95] tracking-tight">QDM Operations</h1>
          <p className="text-slate-500 font-medium">Intelligence Hub & Quality Assurance Command.</p>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex h-auto w-full md:w-auto overflow-x-auto no-scrollbar">
          <TabsTrigger value="inbox" className="rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#4c1d95]">
            <Inbox className="w-4 h-4" /> Review Inbox
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#4c1d95]">
            <BarChart3 className="w-4 h-4" /> Intelligence
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#4c1d95]">
            <Download className="w-4 h-4" /> Data Forge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-slate-200 shadow-xl shadow-[#4c1d95]/5 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-[#4c1d95]/5 px-8 py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-[#4c1d95]">Pending & History</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search by title, submitter..." 
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
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Submitter</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Category</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold text-slate-700 uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKaizens?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <FileText className="w-12 h-12 mb-2" />
                          <p className="text-lg font-bold">No submissions available</p>
                          <p className="text-sm">There are no Kaizens matching your access level or search.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKaizens?.map((kaizen) => (
                      <TableRow key={kaizen.id} className="group hover:bg-[#4c1d95]/5 transition-colors border-slate-100">
                        <TableCell className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-tight group-hover:text-[#4c1d95] transition-colors cursor-pointer" onClick={() => navigate(`/kaizen/${kaizen.id}`)}>
                              {kaizen.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                              Ref: #{kaizen.id.slice(0, 8).toUpperCase()} &bull; {new Date(kaizen.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{kaizen.profiles?.full_name || 'Unknown User'}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{kaizen.departments?.name || 'No Dept'}</span>
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
                        <TableCell className="text-right px-8">
                          <Button variant="ghost" size="sm" className="h-9 font-bold text-[#4c1d95] hover:bg-[#4c1d95]/10" onClick={() => navigate(`/kaizen/${kaizen.id}`)}>
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
        </TabsContent>

        <TabsContent value="intelligence">
          <IntelligenceHub />
        </TabsContent>

        <TabsContent value="reports">
          <ReportForge kaizens={kaizens} />
        </TabsContent>
      </Tabs>
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
