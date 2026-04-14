import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Send,
  Loader2,
  Award,
  AlertCircle
} from "lucide-react";

function getStatusColor(status) {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-700 border-green-200';
    case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
    case 'revision_requested': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export default function KaizenView() {
  const { kaizenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  const [commentText, setCommentText] = useState("");
  const [score, setScore] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Queries
  const { data: kaizen, isLoading } = useQuery({
    queryKey: ["kaizen", kaizenId],
    queryFn: () => api.get(`/kaizens/${kaizenId}`).then((res) => res.data.data.kaizen),
  });

  // Mutations
  const evaluateMutation = useMutation({
    mutationFn: (data) => api.patch(`/kaizens/${kaizenId}/evaluate`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["kaizen", kaizenId]);
      queryClient.invalidateQueries(["kaizens"]);
      setShowRejectForm(false);
      toast({ title: "Evaluation Saved" });
    },
    onError: (err) => toast({ title: "Evaluation Failed", description: err.message, variant: "destructive" }),
  });

  const commentMutation = useMutation({
    mutationFn: (content) => api.post(`/kaizens/${kaizenId}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["kaizen", kaizenId]);
      setCommentText("");
    },
    onError: (err) => toast({ title: "Failed to post message", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!kaizen) return (
    <div className="text-center p-20 text-slate-500 font-bold">Kaizen not found or access denied.</div>
  );

  const isReviewer = ['qdm', 'hod', 'admin', 'superadmin'].includes(profile?.role);
  const canEvaluate = isReviewer && kaizen.status === 'pending';

  const handleApprove = () => {
    let finalScore = parseInt(score);
    if (!finalScore || finalScore < 1 || finalScore > 10) {
      toast({ title: "Score Required", description: "Please assign a score between 1 and 10 to approve.", variant: "destructive" });
      return;
    }
    evaluateMutation.mutate({ status: 'approved', score: finalScore });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({ title: "Reason Required", description: "You must provide a reason for rejecting this Kaizen.", variant: "destructive" });
      return;
    }
    evaluateMutation.mutate({ status: 'rejected', rejection_reason: rejectionReason, score: 0 });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white shadow-sm border border-slate-200">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`font-black uppercase tracking-wider px-3 py-1 text-xs rounded-full ${getStatusColor(kaizen.status)}`}>
            {kaizen.status}
          </Badge>
          <span className="text-sm font-bold text-slate-400">REF: #{kaizen.id.split('-')[0].toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl font-black text-slate-900 leading-tight tracking-tight mb-2">
                    {kaizen.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
                    <span className="text-primary">{kaizen.category}</span>
                    <span>&bull;</span>
                    <span>IMPACT: {kaizen.impact_level}</span>
                  </div>
                </div>
                {kaizen.score > 0 && (
                  <div className="flex flex-col items-center justify-center p-3 px-5 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <Award className="w-6 h-6 text-yellow-600 mb-1" />
                    <span className="text-xl font-black text-yellow-700">{kaizen.score}<span className="text-sm text-yellow-500">/10</span></span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed">
                  {kaizen.description}
                </div>
              </div>

              {kaizen.rejection_reason && (
                <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider text-red-500 mb-1">Rejection Reason</h4>
                    <p className="text-sm font-medium">{kaizen.rejection_reason}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Communication Thread */}
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-row items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">Collaboration Thread</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {kaizen.comments?.length === 0 ? (
                  <p className="text-center text-sm font-bold text-slate-400 italic py-10">No messages yet. Start the conversation!</p>
                ) : (
                  kaizen.comments?.map((comment) => {
                    const isMe = comment.user_id === profile?.id;
                    return (
                      <div key={comment.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                          isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                        }`}>
                          <p className={`text-xs font-black mb-1 opacity-70 ${!isMe && 'text-primary'}`}>
                            {isMe ? 'You' : comment.profiles?.full_name || 'System User'}
                          </p>
                          <p className="text-sm font-medium whitespace-pre-wrap">{comment.content}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest px-1">
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-slate-100 bg-white">
              <form 
                className="flex items-center gap-2 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (commentText.trim()) commentMutation.mutate(commentText);
                }}
              >
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1 border-slate-200 bg-slate-50 h-10 rounded-xl"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commentMutation.isLoading}
                />
                <Button type="submit" size="sm" disabled={commentMutation.isLoading || !commentText.trim()} className="rounded-xl h-10 px-4 font-bold">
                  {commentMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Submitter Info */}
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Initiator Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-black text-lg">
                  {kaizen.submitter?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{kaizen.submitter?.full_name || 'Unknown User'}</h3>
                  <p className="text-xs font-bold text-slate-500">{kaizen.departments?.name || 'No Dept'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Suite (Only for eligible reviewers) */}
          {canEvaluate && (
            <Card className="border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-primary/10 p-6">
                <CardTitle className="text-lg font-black text-primary flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Review Suite
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {!showRejectForm ? (
                  <>
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-slate-500 uppercase tracking-widest text-center w-full block">Assign Score (1-10)</Label>
                      <Input 
                        type="number" 
                        min="1" max="10" 
                        placeholder="10" 
                        className="text-center text-2xl font-black h-14 bg-white border-primary/20 focus:border-primary text-primary mx-auto w-32 rounded-2xl"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary/10">
                      <Button 
                        variant="outline" 
                        className="h-12 border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl"
                        onClick={() => setShowRejectForm(true)}
                        disabled={evaluateMutation.isLoading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        className="h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
                        onClick={handleApprove}
                        disabled={evaluateMutation.isLoading}
                      >
                        {evaluateMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Approve
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-red-500 uppercase tracking-widest">Reason for Rejection</Label>
                      <Textarea 
                        placeholder="Explain why this idea is not viable..."
                        className="bg-white border-red-200 focus:border-red-500 min-h-[100px] rounded-xl"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="flex-1 font-bold text-slate-500"
                        onClick={() => setShowRejectForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-red-500 hover:bg-red-600 font-bold text-white rounded-xl"
                        onClick={handleReject}
                        disabled={evaluateMutation.isLoading}
                      >
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Show the reviewer who took action if it's no longer pending */}
          {kaizen.status !== 'pending' && kaizen.reviewer && (
            <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl opacity-80">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Reviewed By</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-xs">
                    {kaizen.reviewer?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{kaizen.reviewer.full_name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(kaizen.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
