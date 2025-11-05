"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
// import { deleteCheckinById } from "@/actions/checkins"; // ✅ ใช้ deleteCheckinById
import { deleteCheckin, ICheckins } from "@/actions/checkins";

export const columns: ColumnDef<ICheckins>[] = [
  {
    accessorFn: (row) =>
      row.device_id?.student_id ?? "-",
    header: "รหัสนิสิต",
  },
  {
    accessorFn: (row) =>
      row.device_id?.name ?? "-",
    header: "ชื่อ-นามสกุล",
  },
  {
    accessorFn: (row) =>
      row.schedules.course_name ?? "-",
    header: "ชื่อวิชา",
  },
  {
    accessorFn: (row) => row.status || "-",
    header: "สถานะ",
  },
  {
    accessorFn: (row) =>
      new Date(row.timestamp).toLocaleString("th-TH", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    header: "เวลาเช็คอิน",
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const checkin = row.original;

      const handleDelete = async () => {
        Swal.fire({
          title: `แน่ใจหรือไม่?`,
          text: `คุณต้องการลบข้อมูลเช็คอินของ "${checkin.device_id.name}" หรือไม่?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "ใช่, ลบเลย!",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              toast.promise(deleteCheckin(checkin._id), {
                loading: "กำลังลบ...",
                success: (data: any) => data.message || "ลบเรียบร้อย!",
                error: (err) => err.message || "ลบล้มเหลว!",
              });
            } catch (err) {
              console.error(err);
            }
          }
        });
      };

      return (
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 cursor-pointer"
          >
            <Trash size={18} />
          </button>
        </div>
      );
    },
  },
];
