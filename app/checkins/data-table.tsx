"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
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
import { useState } from "react";
import { Search, FileDown } from "lucide-react";
import Papa from "papaparse"; // ✅ ใช้ library สำหรับ CSV export

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  // ✅ ฟังก์ชัน Export CSV เฉพาะข้อมูลที่กรองแล้ว
  const handleExportCSV = () => {
    const filteredRows = table.getFilteredRowModel().rows;

    if (filteredRows.length === 0) {
      alert("ไม่มีข้อมูลที่จะแปลงเป็น CSV");
      return;
    }

    console.log(filteredRows[0]);
    

    // ดึงข้อมูลจริงจาก rows
    const filteredData = filteredRows.map((row:any) => ({
      student_id: row.original.device_id.student_id,
      name: row.original.device_id.name,
      subject: row.original.schedules.course_name,
      time: new Date(row.original.timestamp).toLocaleString(),
      status: row.original.status
    }));

    // ใช้ PapaParse แปลงเป็น CSV
    const csv = Papa.unparse(filteredData, {
      header: true,
      skipEmptyLines: true,
    });

    // สร้าง Blob และดาวน์โหลด
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); // \uFEFF รองรับภาษาไทย
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_checkins.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* ✅ แถวบนสุด: ปุ่ม Export + ช่องค้นหา */}
      <div className="flex gap-2 justify-end items-center mb-2">
        <div className="relative max-w-lg">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="ค้นหา..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full p-2 pl-10 pr-3 shadow rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <FileDown size={18} />
          Export CSV
        </Button>

      </div>

      {/* ตารางข้อมูล */}
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ปุ่มเปลี่ยนหน้า */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ย้อนกลับ
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          ถัดไป
        </Button>
      </div>
    </div>
  );
}
