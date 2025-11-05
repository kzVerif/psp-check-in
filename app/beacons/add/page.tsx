import { getZonesPolygonAndRoom } from "@/actions/zones";
import AddBeaconForm, { Zone } from "@/components/AddBeaconForm";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

interface ZoneData {
  success: boolean;
  zones: Zone[];
}

export default async function Page() {
  const data: ZoneData = await getZonesPolygonAndRoom();

  return (
    <div className="container mx-auto mt-12 px-4">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Add Beacons
          </h1>
          <p className="text-gray-500 mt-1">
            กรอกข้อมูลของอุปกรณ์บลูทูธเพื่อเพิ่มเข้าระบบ
          </p>
        </div>

        <Link href="/beacons">
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 ease-in-out cursor-pointer">
            <CircleChevronLeft size={18} />
            ย้อนกลับ
          </button>
        </Link>
      </div>

      {/* Card Section */}
      {data?.success ? (
        <AddBeaconForm zones={data.zones} />
      ) : (
        <p className="text-red-500">ไม่สามารถโหลดข้อมูลโซนได้</p>
      )}
    </div>
  );
}
