"use client";

import { deleteDevices } from "@/actions/device";
import Avatar from "boring-avatars";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function ManageDevice({ devices }: { devices: any[] }) {
  const [data, setData] = useState(devices);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.student_id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filtered.slice(startIndex, startIndex + limit);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "แน่ใจหรือไม่?",
      text: "การลบนี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resPromise = toast.promise(deleteDevices(id), {
            loading: "กำลังลบ...",
            success: (data) => data.message || "ลบเรียบร้อย!",
            error: (err) => err.message || "ลบล้มเหลว!",
          });

          const res = await resPromise.unwrap();
          console.log(res.success);

          if (res.success) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // หน่วง 0.5 วิ
            window.location.reload();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div>
      {/* ช่องค้นหา */}
      <div className="relative max-w-md float-right mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="ค้นหาจาก ชื่อหรือรหัสนิสิต"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pl-10 pr-3 shadow rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* รายการอุปกรณ์ */}
      <ul className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 clear-both">
        {currentData.map((d, i) => (
          <li
            key={i}
            className="bg-white shadow-md rounded-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <Avatar name={d.name} variant="beam" size="80" className="mb-3" />
            <h1 className="text-lg font-semibold text-gray-800">{d.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{d.student_id}</p>
            <div className="flex gap-2">
              <Link href={`/devices/${d.student_id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm cursor-pointer">
                  แก้ไขอุปกรณ์
                </button>
              </Link>
              <button
                onClick={() => handleDelete(d.student_id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm cursor-pointer"
              >
                ลบอุปกรณ์
              </button>
            </div>
          </li>
        ))}

        {currentData.length === 0 && (
          <li className="col-span-full text-center text-gray-500 py-10">
            ไม่พบข้อมูล
          </li>
        )}
      </ul>

      {filtered.length > limit && (
        <div className="flex gap-2 justify-end mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded-xl disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  );
}
