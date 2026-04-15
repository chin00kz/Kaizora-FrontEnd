import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Ban, 
  Loader2,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// New Data Table Components
import { DataTable } from "@/components/DataTable";
import { columns } from "./user-columns";

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
    department_id: "no_dept"
  });
  
  // Queries
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data.data.profiles),
  });

  const { data: deptsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => api.get("/departments").then((res) => res.data.data.departments),
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (newUser) => api.post("/users/create", newUser),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setIsCreateModalOpen(false);
      setCreateFormData({
        full_name: "",
        email: "",
        password: "",
        role: "employee",
        department_id: "no_dept"
      });
      toast({ title: "User created successfully", description: "The new user can now log in." });
    },
    onError: (err) => toast({ title: "Error creating user", description: err.message, variant: "destructive" }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => api.patch(`/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({ title: "Role updated" });
    },
  });

  const updateDeptMutation = useMutation({
    mutationFn: ({ userId, departmentId }) => api.patch(`/users/${userId}/department`, { department_id: departmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({ title: "Department assigned" });
    },
  });

  const toggleBanMutation = useMutation({
    mutationFn: ({ userId, isBanned }) => api.patch(`/users/${userId}/ban`, { is_banned: !isBanned }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({ title: "Status updated" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ userId, isApproved }) => api.patch(`/users/${userId}/approve`, { is_approved: isApproved }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["users"]);
      toast({ 
        title: variables.isApproved ? "✅ User Approved" : "User access revoked",
        description: variables.isApproved ? "The user can now log in to the platform." : "The user has been set to pending."
      });
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkApproveMutation = useMutation({
    mutationFn: (userIds) => Promise.all(userIds.map(id => api.patch(`/users/${id}/approve`, { is_approved: true }))),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({ title: "✅ Users Approved", description: "All selected users have been activated." });
    },
    onError: (err) => toast({ title: "Bulk Approval Error", description: err.message, variant: "destructive" }),
  });

  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const fetchUserStats = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}/stats`);
      setSelectedUserStats({
        ...res.data.data.stats,
        userName: usersData.find(u => u.id === userId)?.full_name
      });
      setIsStatsModalOpen(true);
    } catch (err) {
      toast({ title: "Error fetching stats", description: err.message, variant: "destructive" });
    }
  };

  const stats = {
    total: usersData?.length || 0,
    pending: usersData?.filter(u => !u.is_approved).length || 0,
    banned: usersData?.filter(u => u.is_banned).length || 0,
    superadmins: usersData?.filter(u => u.role === 'superadmin').length || 0,
  };

  // Generate Table Columns
  const userColumns = columns(
    deptsData, 
    updateRoleMutation, 
    updateDeptMutation, 
    approveMutation, 
    toggleBanMutation, 
    fetchUserStats
  );

  if (usersLoading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Modal */}
      <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">{selectedUserStats?.userName}'s Performance</DialogTitle>
            <DialogDescription>
              Userwise impact and submission tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center">
              <span className="text-3xl font-black text-primary">{selectedUserStats?.totalSubmissions}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Ideas</span>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center">
              <span className="text-3xl font-black text-green-600">{selectedUserStats?.approved}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Approved</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center">
              <span className="text-3xl font-black text-amber-600">{selectedUserStats?.pending}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">In Review</span>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center">
              <span className="text-3xl font-black text-red-600">{selectedUserStats?.rejected}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Rejected</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsStatsModalOpen(false)} className="w-full font-bold text-white bg-primary rounded-xl">Close Hub</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage corporate identities, roles, and access.</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
              <UserPlus className="w-4 h-4 mr-2" />
              Onboard New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">Create User</DialogTitle>
              <DialogDescription>
                Manually add a user to the system. They can log in immediately with the temporary password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const submissionData = { ...createFormData };
              if (submissionData.department_id === "no_dept") {
                submissionData.department_id = null;
              }
              createUserMutation.mutate(submissionData);
            }} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  value={createFormData.full_name}
                  onChange={(e) => setCreateFormData({...createFormData, full_name: e.target.value})}
                  placeholder="John Doe" 
                  required 
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                  placeholder="name@fedexlk.com" 
                  required 
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                  placeholder="••••••••"
                  required 
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Initial Role</Label>
                  <Select 
                    value={createFormData.role}
                    onValueChange={(val) => setCreateFormData({...createFormData, role: val})}
                  >
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="qdm">QDM Team</SelectItem>
                      <SelectItem value="hod">Head of Dept</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select 
                    value={createFormData.department_id}
                    onValueChange={(val) => setCreateFormData({...createFormData, department_id: val})}
                  >
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_dept">None (Standalone)</SelectItem>
                      {deptsData?.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={createUserMutation.isLoading} className="w-full font-bold rounded-xl bg-primary text-white">
                  {createUserMutation.isLoading ? <Loader2 className="animate-spin" /> : "Create Identity"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Total Users</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Pending Approval</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.pending}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Banned</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.banned}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Super Admins</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.superadmins}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identity Directory Card */}
      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Identity Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable 
            columns={userColumns} 
            data={usersData || []} 
            searchPlaceholder="Filter identities..."
            onBulkApprove={(userIds) => bulkApproveMutation.mutate(userIds)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
