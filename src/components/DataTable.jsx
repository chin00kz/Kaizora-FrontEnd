import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  CheckCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Filter
} from "lucide-react";

export function DataTable({ 
  columns, 
  data, 
  searchPlaceholder = "Search...",
  onBulkApprove,
  onBulkDelete,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleExportCSV = () => {
    if (selectedRows.length === 0) return;
    
    // Header
    const headers = ["ID", "Name", "Email", "Role", "Department", "Approved", "Status"];
    
    // Data rows
    const rows = selectedRows.map(row => {
      const u = row.original;
      return [
        u.id,
        u.full_name,
        u.email,
        u.role,
        u.departments?.name || "None",
        u.is_approved ? "Yes" : "No",
        u.is_banned ? "Banned" : "Active"
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Toolbar */}
      <div className="flex items-center justify-between px-8 py-4 bg-slate-50/50 border-b border-slate-100">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9 h-10 bg-white border-slate-200 rounded-xl shadow-sm focus-visible:ring-primary focus-visible:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2 bg-slate-100 px-3 py-1 rounded-full">
                {selectedRows.length} Selected
              </span>
              
              {onBulkApprove && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onBulkApprove(selectedRows.map(r => r.original.id))}
                  className="h-9 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 font-bold rounded-lg text-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-2" />
                  Approve All
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
                className="h-9 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold rounded-lg text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                Export CSV
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-slate-400 hover:text-slate-600 rounded-xl">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-none border-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-8 h-12">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-slate-50/50 transition-colors border-slate-100 data-[state=selected]:bg-primary/[0.02]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-8 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-400 font-medium italic"
                >
                  No identity found matching the search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-slate-50/30">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-9 px-4 border-slate-200 rounded-xl font-bold bg-white disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-9 px-4 border-slate-200 rounded-xl font-bold bg-white disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
