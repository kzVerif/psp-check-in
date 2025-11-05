import { getAllZones } from "@/actions/zones";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import ClientTable from "./ClientTable";

export default async function Page() {
  const data = await getAllZones()
  
  return (
    <div className="container mt-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-medium">Zones</h1>
          <h2>จัดการเขตพื้นที่</h2>
        </div>
        <Link href="/zones/add">
          <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer ">
            <CirclePlus size={18} /> เพิ่มเขตพื้นที่
          </button>
        </Link>
      </div>

      {/* ✅ render client-only table */}
      <ClientTable data={data.zones}/>

    </div>
  );
}
