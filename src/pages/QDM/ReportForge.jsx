import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileJson, 
  FileText, 
  Table as TableIcon, 
  Download, 
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function ReportForge({ kaizens }) {
  const [isExporting, setIsExporting] = useState(null);

  const handleCSVExport = () => {
    setIsExporting('csv');
    const data = kaizens.map(k => ({
      ID: k.id.slice(0, 8),
      Title: k.title,
      Submitter: k.profiles?.full_name || 'N/A',
      Department: k.departments?.name || 'N/A',
      Category: k.category,
      Status: k.status,
      Score: k.score || 0,
      Impact: k.impact_level || 'N/A',
      SubmittedAt: new Date(k.created_at).toLocaleDateString()
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `kaizora_pulse_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(null);
  };

  const handlePDFExport = () => {
    setIsExporting('pdf');
    const doc = new jsPDF();
    
    // Add Branding Header
    doc.setFontSize(22);
    doc.setTextColor(76, 29, 149); // #4c1d95
    doc.text("KAIZORA PULSE REPORT", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text("Corporate Improvement & Innovation Tracker", 14, 35);

    const tableData = kaizens.map(k => [
      k.title,
      k.profiles?.full_name || 'N/A',
      k.status.toUpperCase(),
      k.score || '0'
    ]);

    doc.autoTable({
      startY: 45,
      head: [['Title', 'Innovator', 'Status', 'Score']],
      body: tableData,
      headStyles: { fillColor: [76, 29, 149] },
      styles: { fontSize: 8 },
      margin: { top: 40 }
    });

    doc.save(`kaizora_executive_summary_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsExporting(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CSV Forge */}
        <Card className="border-0 shadow-xl rounded-3xl bg-white overflow-hidden group">
            <div className="h-2 bg-emerald-500" />
            <CardHeader className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TableIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-black text-slate-800">Raw Data Insight</CardTitle>
                <CardDescription className="text-slate-500 font-medium pt-1">
                    Export the full system pipeline for advanced analysis in Excel or Google Sheets.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <Button 
                    variant="outline" 
                    onClick={handleCSVExport}
                    disabled={isExporting === 'csv' || !kaizens?.length}
                    className="w-full h-14 rounded-2xl border-2 border-slate-100 font-bold gap-3 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                >
                    <Download className="w-4 h-4" />
                    {isExporting === 'csv' ? 'Generating Sheet...' : 'Export to CSV'}
                </Button>
            </CardContent>
        </Card>

        {/* PDF Forge */}
        <Card className="border-0 shadow-xl rounded-3xl bg-white overflow-hidden group">
            <div className="h-2 bg-[#4c1d95]" />
            <CardHeader className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-[#4c1d95]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-[#4c1d95]" />
                </div>
                <CardTitle className="text-xl font-black text-slate-800">Executive Summary</CardTitle>
                <CardDescription className="text-slate-500 font-medium pt-1">
                    Generate a polished PDF report optimized for management presentations and archive.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <Button 
                    onClick={handlePDFExport}
                    disabled={isExporting === 'pdf' || !kaizens?.length}
                    className="w-full h-14 rounded-2xl bg-[#4c1d95] hover:bg-[#5b21b6] font-bold gap-3 shadow-lg shadow-[#4c1d95]/20 transition-all text-white"
                >
                    <Sparkles className="w-4 h-4" />
                    {isExporting === 'pdf' ? 'Forging Report...' : 'Generate PDF Report'}
                </Button>
            </CardContent>
        </Card>

      </div>

      {/* Stats Summary Tooltip */}
      <Card className="border-slate-100 bg-slate-50/50 rounded-3xl p-8 border-dashed border-2">
         <div className="flex items-start gap-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
                <h4 className="font-black text-slate-800">Report Status: READY</h4>
                <p className="text-sm text-slate-500 font-medium">Your current view contains **{kaizens?.length || 0}** records. Filters applied on the main inbox will be reflected in your exports.</p>
                <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" /> Latest Sync: Now
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Layers className="w-3 h-3" /> Tier: Enterprise
                    </div>
                </div>
            </div>
         </div>
      </Card>
    </div>
  );
}
