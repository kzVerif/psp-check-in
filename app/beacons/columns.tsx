"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { deleteBeaconById } from "@/actions/beacons";
// import { deleteBeacon } from "@/actions/beacon" // ✅ สร้าง action ลบ Beacon แยกไว้

// columns.tsx
export type Beacons = {
  _id: string;
  label: string;
  mac_address: string;
  x: number;
  y: number;
  zone_id:
    | null // ✅ เพิ่มตรงนี้
    | string
    | {
        _id: string;
        room: {
          floor: number;
          room_number: string;
          building: {
            code: string;
            name: string;
          };
        };
      };
};

export const columns: ColumnDef<Beacons>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "mac_address",
    header: "MAC Address",
  },
  {
    accessorKey: "x",
    header: "ตำแหน่ง X",
  },
  {
    accessorKey: "y",
    header: "ตำแหน่ง Y",
  },
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
      const beacon = row.original;

      const handleDelete = async () => {
        Swal.fire({
          title: `แน่ใจหรือไม่?`,
          text: `คุณต้องการลบ Beacon "${beacon.label}" หรือไม่? การลบนี้จะไม่สามารถกู้คืนได้!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "ใช่, ลบเลย!",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const resPromise = toast.promise(deleteBeaconById(beacon._id), {
                loading: "กำลังลบ...",
                success: (data) => data.message || "ลบเรียบร้อย!",
                error: (err) => err.message || "ลบล้มเหลว!",
              })
            } catch (err) {
              console.error(err)
            }
          }
        });
      };

      return (
        <div className="flex gap-2">
          <Link href={`/beacons/${beacon._id}`}>
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
