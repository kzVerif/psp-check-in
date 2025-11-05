import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { getAllBeacons } from "@/actions/beacons";
import { getAllSchedules, ISchedules } from "@/actions/schedules";
import { getAllCheckins } from "@/actions/checkins";
import ClientTable from "./ClientTable";

export default async function Page() {
  const data = await getAllCheckins();
  // console.log(data.checkins);
  

  return (
    <div className="container mt-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-medium">Checkins</h1>
          <h2>จัดการการลงชื่อเข้าเรียน</h2>
        </div>
        <Link href="/checkins/add">
          <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer ">
            <CirclePlus size={18} /> เพิ่มการลงชื่อ
          </button>
        </Link>
      </div>

      {/* ✅ render client-only table */}
      
      <ClientTable data={data.checkins}/>
    </div>
  );
}
