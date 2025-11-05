import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { getAllBeacons } from "@/actions/beacons";
import { getAllSchedules, ISchedules } from "@/actions/schedules";
import ClientTable from "./ClientTable";

export default async function Page() {
  const data = await getAllSchedules();

  return (
    <div className="container mt-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-medium">Schedules</h1>
          <h2>จัดการตารางสอน</h2>
        </div>
        <Link href="/schedules/add">
          <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer ">
            <CirclePlus size={18} /> เพิ่มตามรางสอน
          </button>
        </Link>
      </div>

      {/* ✅ render client-only table */}
      
      <ClientTable data={data.schedules}/>
    </div>
  );
}
