"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
// import { deleteZoneById } from "@/actions/zones"; // ✅ เปลี่ยนเป็น zones จริง
import { deleteZone, zoneTable } from "@/actions/zones";

export const columns: ColumnDef<zoneTable>[] = [
  {
    accessorKey: "room.building.name",
    header: "ตึก",
  },
  {
    accessorKey: "room.floor",
    header: "ชั้น",
  },
  {
    accessorKey: "room.room_number",
    header: "เลขห้อง",
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const zone = row.original;

      const handleDelete = async () => {
        Swal.fire({
          title: `แน่ใจหรือไม่?`,
          text: `คุณต้องการลบโซน "${zone.room.room_number}" หรือไม่? การลบนี้จะไม่สามารถกู้คืนได้!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "ใช่, ลบเลย!",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await toast.promise(deleteZone(zone._id), {
                loading: "กำลังลบ...",
                success: (data) => data.message || "ลบเรียบร้อย!",
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
          <Link href={`/zones/${zone._id}`}>
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
