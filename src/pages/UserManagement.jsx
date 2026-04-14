import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Building, 
  Search, 
  MoreHorizontal,
  Ban,
  Trash2,
  BarChart3,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
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

  // Filtered Users
  const filteredUsers = usersData?.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: usersData?.length || 0,
    banned: usersData?.filter(u => u.is_banned).length || 0,
    superadmins: usersData?.filter(u => u.role === 'superadmin').length || 0,
  };

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
            <Button onClick={() => setIsStatsModalOpen(false)} className="w-full font-bold">Close Hub</Button>
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
              // Clean up department_id if no_dept
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
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                  placeholder="john@advantis.express" 
                  required 
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
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Initial Role</Label>
                  <Select 
                    value={createFormData.role}
                    onValueChange={(val) => setCreateFormData({...createFormData, role: val})}
                  >
                    <SelectTrigger>
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
                  {deptsData?.length > 0 ? (
                    <Select 
                      value={createFormData.department_id}
                      onValueChange={(val) => setCreateFormData({...createFormData, department_id: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_dept">None (Standalone)</SelectItem>
                        {deptsData.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] text-amber-600 font-bold bg-amber-50 p-2 rounded border border-amber-100 italic">
                        No departments found. Create one first!
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-xs font-bold text-primary underline justify-start"
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          window.location.href = "/department";
                        }}
                      >
                        Manage Departments ➔
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={createUserMutation.isLoading} className="w-full font-bold">
                  {createUserMutation.isLoading ? <Loader2 className="animate-spin" /> : "Create Identity"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm rounded-2xl">
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
        <Card className="border-slate-200 shadow-sm rounded-2xl">
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
        <Card className="border-slate-200 shadow-sm rounded-2xl">
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

      {/* User Table Card */}
      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Identity Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search users..." 
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
                <TableHead className="px-8 font-bold text-slate-700 uppercase text-[10px] tracking-widest">Identity</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Role</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Department</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right px-8 font-bold text-slate-700 uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-200">
                        {user.full_name?.charAt(0) || user.email?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">{user.full_name}</span>
                        <span className="text-xs text-slate-500 mt-1">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      disabled={user.role === 'superadmin' || updateRoleMutation.isLoading}
                      defaultValue={user.role} 
                      onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                    >
                      <SelectTrigger className="w-32 h-8 text-[11px] font-bold uppercase tracking-wider rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Staff</SelectItem>
                        <SelectItem value="qdm">QDM Team</SelectItem>
                        <SelectItem value="hod">HOD</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      disabled={user.role === 'superadmin' || updateDeptMutation.isLoading}
                      defaultValue={user.department_id} 
                      onValueChange={( विभागId ) => updateDeptMutation.mutate({ userId: user.id, departmentId: विभागId })}
                    >
                      <SelectTrigger className="w-32 h-8 text-[11px] font-medium rounded-lg">
                        <SelectValue placeholder="No Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_dept">None</SelectItem>
                        {deptsData?.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-50 font-bold px-3 py-1 rounded-full text-[10px]">
                        Banned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-50 font-bold px-3 py-1 rounded-full text-[10px]">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fetchUserStats(user.id)}
                        className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={user.role === 'superadmin'}
                        onClick={() => toggleBanMutation.mutate({ userId: user.id, isBanned: user.is_banned })}
                        className={`h-8 w-8 transition-colors ${user.is_banned ? "text-green-500 hover:bg-green-50" : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}
                      >
                        {user.is_banned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
