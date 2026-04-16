import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  BarChart3,
  CheckCircle2,
  Ban,
  UserX,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Key,
  Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns = (
  deptsData,
  updateRoleMutation,
  updateDeptMutation,
  approveMutation,
  toggleBanMutation,
  fetchUserStats,
  onEditUser,
  onResetPassword,
  onDeleteUser
) => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-bold text-slate-700 uppercase text-[10px] tracking-widest"
        >
          Identity
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-slate-200 shadow-sm">
              <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email || 'guest')}`} />
              <AvatarFallback className="bg-slate-100 font-bold text-slate-600 text-sm">
                {user.full_name?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 leading-none truncate">{user.full_name}</span>
              <span className="text-xs text-slate-500 mt-1 truncate">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            disabled={user.role === 'superadmin' || updateRoleMutation.isLoading}
            defaultValue={user.role}
            onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
          >
            <SelectTrigger className="w-32 h-8 text-[11px] font-bold uppercase tracking-wider rounded-lg border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Staff</SelectItem>
              <SelectItem value="qdm">QDM Team</SelectItem>
              <SelectItem value="hod">HOD</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "department_id",
      header: "Department",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            disabled={user.role === 'superadmin' || updateDeptMutation.isLoading}
            defaultValue={user.department_id || "no_dept"}
            onValueChange={(deptId) => updateDeptMutation.mutate({ userId: user.id, departmentId: deptId === "no_dept" ? null : deptId })}
          >
            <SelectTrigger className="w-32 h-8 text-[11px] font-medium rounded-lg border-slate-200">
              <SelectValue placeholder="No Dept" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_dept">None</SelectItem>
              {deptsData?.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "is_approved",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Switch
              disabled={user.role === 'superadmin' || approveMutation.isLoading}
              checked={user.is_approved}
              onCheckedChange={(checked) => approveMutation.mutate({ userId: user.id, isApproved: checked })}
              aria-label="Toggle Approval"
              className="data-[state=checked]:bg-green-500"
            />
            {!user.is_approved ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase">
                Pending
              </Badge>
            ) : user.is_banned ? (
              <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-50 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase">
                Banned
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-50 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase">
                Active
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: ({ table }) => <div className="text-right pr-4">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center justify-end gap-3 pr-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchUserStats(user.id)}
              className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
              title="User Performance"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-slate-100">
                <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-400">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />

                <DropdownMenuItem onClick={() => onEditUser(user)} className="cursor-pointer font-bold focus:bg-slate-50 focus:text-primary">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onResetPassword(user)} className="cursor-pointer font-bold focus:bg-slate-50 focus:text-primary">
                  <Key className="mr-2 h-4 w-4" />
                  <span>Reset Password</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-100" />

                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBanMutation.mutate({ userId: user.id, isBanned: user.is_banned });
                  }}
                  disabled={user.role === 'superadmin' || toggleBanMutation.isLoading}
                  className={`cursor-pointer font-bold ${user.is_banned ? 'focus:bg-green-50 focus:text-green-600 text-green-600' : 'focus:bg-orange-50 focus:text-orange-600 text-orange-600'}`}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  <span>{user.is_banned ? 'Unban User' : 'Ban User'}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDeleteUser(user)}
                  disabled={user.role === 'superadmin'}
                  className="cursor-pointer font-black text-red-600 focus:bg-red-50 focus:text-red-700 mt-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
