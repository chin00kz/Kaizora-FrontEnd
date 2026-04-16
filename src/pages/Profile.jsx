import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/client";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Shield, User, Lock, Save, LayoutTemplate } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import superadminAvatar from "../assets/superadmin.jpg";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  // Fetch departments to resolve the UUID to a real name
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments').then(res => res.data.data.departments || []),
  });
  
  const deptName = departments?.find(d => d.id === profile?.department_id)?.name || profile?.department_id || "Unassigned";

  const updateProfileMutation = useMutation({
    mutationFn: (data) => api.patch('/users/me', data),
    onSuccess: () => {
      refreshProfile();
      toast({ title: "Profile saved successfully" });
    },
    onError: (err) => toast({ title: "Failed to save profile", description: err.message, variant: "destructive" })
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    
    setIsChangingPassword(true);
    try {
      // Re-verify Old Password by attempting sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) throw new Error("Incorrect current password.");

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;
      
      toast({ title: "Password changed successfully" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast({ title: "Failed to change password", description: err.message, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profile Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your personal identity, roles, and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column - Identity preview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl text-center">
            <CardContent className="p-6 pt-10 flex flex-col items-center">
              <Avatar className="w-28 h-28 border-4 border-white shadow-xl shadow-slate-200/50 mb-5 relative">
                <AvatarImage src={profile.role === 'superadmin' ? superadminAvatar : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.email || '')}`} className="bg-slate-50 object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-black text-3xl">
                  {profile.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-black text-slate-800 leading-tight">{profile.full_name}</h2>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{profile.role}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-3 space-y-6">
          
          <Card className="border-slate-100 shadow-md shadow-slate-200/30 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-base font-bold text-slate-800">Basic Information</CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-400">Core identity limits</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfileMutation.mutate({ full_name: fullName });
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label className="text-slate-600 font-semibold px-1">Email address <span className="text-slate-400 font-normal text-xs ml-1">(Locked)</span></Label>
                    <Input value={user?.email || ""} disabled className="h-12 bg-slate-50/50 text-slate-500 rounded-xl border-slate-100 shadow-none font-medium" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-600 font-semibold px-1">Department <span className="text-slate-400 font-normal text-xs ml-1">(Admin Assigned)</span></Label>
                    <div className="relative">
                      <LayoutTemplate className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input value={deptName} disabled className="h-12 pl-11 bg-slate-50/50 text-slate-600 rounded-xl border-slate-100 shadow-none font-semibold truncate" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 pt-2">
                  <Label htmlFor="full_name" className="text-slate-600 font-semibold px-1">Full Legal Name</Label>
                  <Input 
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 font-medium focus-visible:ring-primary/20 text-slate-800"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button disabled={updateProfileMutation.isLoading} type="submit" className="w-full sm:w-auto h-11 px-8 font-bold rounded-xl shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all">
                    {updateProfileMutation.isLoading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-md shadow-slate-200/30 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-base font-bold text-slate-800 leading-none mb-1.5">Security Parameters</CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-400">Require old password verification</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="old_pw" className="text-slate-600 font-semibold px-1">Current Password</Label>
                    <Input 
                      id="old_pw"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-orange-500/20"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="hidden md:block"></div> {/* Spacer */}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new_pw" className="text-slate-600 font-semibold px-1">New Password</Label>
                    <Input 
                      id="new_pw"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-orange-500/20"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c_pw" className="text-slate-600 font-semibold px-1">Confirm New Password</Label>
                    <Input 
                      id="c_pw"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-orange-500/20"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button disabled={isChangingPassword} type="submit" variant="outline" className="w-full sm:w-auto h-11 px-8 font-bold rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all">
                    {isChangingPassword ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Lock className="mr-2 w-4 h-4" />}
                    Update Access Key
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
