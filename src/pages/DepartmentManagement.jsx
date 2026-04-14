import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Plus, 
  Search, 
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DepartmentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: "", description: "" });
  const [editingDept, setEditingDept] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "" });
  
  // Queries
  const { data: deptsData, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: () => api.get("/departments").then((res) => res.data.data.departments),
  });

  // Mutations
  const createDeptMutation = useMutation({
    mutationFn: (newDept) => api.post("/departments", newDept),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setIsCreateModalOpen(false);
      setCreateFormData({ name: "", description: "" });
      toast({ title: "Department created" });
    },
    onError: (err) => {
      toast({ 
        title: "Creation failed", 
        description: err.response?.data?.message || err.message, 
        variant: "destructive" 
      });
    }
  });

  const updateDeptMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/departments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setEditingDept(null);
      toast({ title: "Department updated" });
    },
    onError: (err) => {
      toast({ 
        title: "Update failed", 
        description: err.response?.data?.message || err.message, 
        variant: "destructive" 
      });
    }
  });

  const deleteDeptMutation = useMutation({
    mutationFn: (id) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      toast({ title: "Department deleted" });
    },
  });

  const filteredDepts = deptsData?.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Departmental Structure</h1>
          <p className="text-slate-500 font-medium">Define your organization's hierarchy and reporting lines.</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              New Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">Create Department</DialogTitle>
              <DialogDescription>
                Add a new functional unit to the Kaizora ecosystem.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              createDeptMutation.mutate(createFormData);
            }} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Department Name</Label>
                <Input 
                  id="name" 
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                  placeholder="e.g. Quality Assurance" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                  placeholder="Brief overview of responsibilities" 
                />
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={createDeptMutation.isLoading} className="w-full font-bold">
                  {createDeptMutation.isLoading ? <Loader2 className="animate-spin" /> : "Establish Department"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts?.map((dept) => (
          <Card key={dept.id} className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all group">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setEditingDept(dept);
                          setEditFormData({ name: dept.name, description: dept.description });
                        }}
                        className="h-8 w-8 text-slate-400 hover:text-primary rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Department</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        updateDeptMutation.mutate({ id: dept.id, data: editFormData });
                      }} className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <Label>Name</Label>
                          <Input 
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Description</Label>
                          <Input 
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                          />
                        </div>
                        <Button type="submit" disabled={updateDeptMutation.isLoading} className="w-full mt-4 font-bold">
                          {updateDeptMutation.isLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => { if(confirm('Delete department?')) deleteDeptMutation.mutate(dept.id) }}
                    className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4 text-xl font-black text-slate-900 tracking-tight">{dept.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                {dept.description || "No description provided for this department."}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <Briefcase className="w-3 h-3" />
                  Unit active
                </div>
                <Badge variant="outline" className="rounded-full bg-primary/5 text-primary text-[10px] border-primary/10">
                  Kaizora Node
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDepts?.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-medium">No departments found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
