"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { deleteSchedulesById, ISchedules } from "@/actions/schedules";
// import { deleteScheduleById } from "@/actions/schedules";

export const columns: ColumnDef<ISchedules>[] = [
  {
    accessorKey: "course_code",
    header: "รหัสวิชา",
  },
  {
    accessorKey: "course_name",
    header: "ชื่อวิชา",
  },
  // {
  //   accessorKey: "day_of_week",
  //   header: "วันเรียน",
  // },
  // {
  //   accessorKey: "semester",
  //   header: "ปีการศึกษา",
  // },
  // {
  //   accessorKey: "start_time",
  //   header: "เริ่มเรียน",
  // },
  // {
  //   accessorKey: "end_time",
  //   header: "จบเรียน",
  // },
  {
    accessorFn: (row) =>
      !row.zone_id || typeof row.zone_id === "string"
        ? "-"
        : row.zone_id.room.room_number,
    header: "ห้องเรียน",
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const schedule = row.original;

      const handleDelete = async () => {
        Swal.fire({
          title: `แน่ใจหรือไม่?`,
          text: `คุณต้องการลบรายวิชา "${schedule.course_name}" หรือไม่? การลบนี้จะไม่สามารถกู้คืนได้!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "ใช่, ลบเลย!",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
             toast.promise(deleteSchedulesById(schedule._id), {
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
          <Link href={`/schedules/${schedule._id}`}>
            <button className="p-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black transition-colors duration-200 cursor-pointer">
              <Pencil size={18} />
            </button>
          </Link>
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
