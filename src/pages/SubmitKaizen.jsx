import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Lightbulb, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Trophy,
  ArrowLeft,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitKaizen() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  
  // Queries
  const { data: deptsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => api.get("/departments").then((res) => res.data.data.departments),
  });

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/users/me").then((res) => res.data.data.profile),
  });

  // Mutations
  const submitKaizenMutation = useMutation({
    mutationFn: (data) => api.post("/kaizens", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["kaizens"]);
      toast({ 
        title: "Kaizen Submitted!", 
        description: "Your idea has been sent to the QDM team for review.",
      });
      navigate("/my-kaizens");
    },
    onError: (err) => toast({ 
      title: "Submission failed", 
      description: err.message, 
      variant: "destructive" 
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // If category is "Other", append the specific detail if needed
    if (category === "Other" && data.other_category_detail) {
      data.category = `Other: ${data.other_category_detail}`;
    }

    submitKaizenMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Submit Kaizen</h1>
            <p className="text-slate-500 font-medium">Be the fuel for continuous improvement.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-primary">Earn points for every idea</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">Idea Details</CardTitle>
              </div>
              <CardDescription className="text-base">
                Define the problem and your proposed solution clearly.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-bold text-slate-700 uppercase tracking-widest leading-none">Kaizen Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g. Automated labeling for Export shipments" 
                  required 
                  className="h-14 text-lg font-medium bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-2xl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700 uppercase tracking-widest leading-none">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe the current issue and how your suggestion improves it..." 
                  required 
                  className="min-h-[200px] text-base bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-2xl p-4 leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem]">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Categorization</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Category</Label>
                <Select name="category" required onValueChange={setCategory}>
                  <SelectTrigger className="h-12 bg-slate-50/50 rounded-xl">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    <SelectItem value="Safety">Safety First</SelectItem>
                    <SelectItem value="Quality">Quality Excellence</SelectItem>
                    <SelectItem value="Cost">Cost Optimization</SelectItem>
                    <SelectItem value="Delivery">Delivery & Speed</SelectItem>
                    <SelectItem value="Productivity">Productivity Boost</SelectItem>
                    <SelectItem value="Other">Other / Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {category === "Other" && (
                <div className="grid gap-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Please Specify</Label>
                  <Input 
                    name="other_category_detail" 
                    placeholder="Enter category name..." 
                    required 
                    className="h-12 bg-white rounded-xl"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Expected Impact</Label>
                <Select name="impact_level" defaultValue="medium">
                  <SelectTrigger className="h-12 bg-slate-50/50 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    <SelectItem value="low">Low Impact</SelectItem>
                    <SelectItem value="medium">Medium Impact</SelectItem>
                    <SelectItem value="high">High Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Submitting For</Label>
                <Select name="department_id" defaultValue={meData?.department_id || ""}>
                  <SelectTrigger className="h-12 bg-slate-50/50 rounded-xl">
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    {deptsData?.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-0 shadow-2xl shadow-slate-900/30 rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Briefcase className="w-16 h-16" />
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Ready to Launch?</CardTitle>
              <CardDescription className="text-slate-400">
                Ensure your description includes the estimated time or cost savings.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-0">
              <Button 
                type="submit" 
                disabled={submitKaizenMutation.isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] text-base"
              >
                {submitKaizenMutation.isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Publish Kaizen
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-400">
            <AlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
            Submission is permanent and will be logged under your identity for evaluation.
          </div>
        </div>
      </form>
    </div>
  );
}
