import { getAllBeaconForZone, zoneBeacons } from "@/actions/beacons";
import { getAllSchedulesForZone } from "@/actions/schedules";
import { getZonesPolygonAndRoom } from "@/actions/zones";
import { Zone } from "@/components/AddBeaconForm";
import AddSchedulesForm from "@/components/AddSchedulesForm";
import AddZoneForm from "@/components/AddZoneForm";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

interface ZoneData {
  success: boolean;
  zones: Zone[];
}

export default async function Page() {
  const beaconData = await getAllBeaconForZone() 
  const scheduleData = await getAllSchedulesForZone()

  return (
    <div className="container mx-auto mt-12 px-4">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Add Zones
          </h1>
          <p className="text-gray-500 mt-1">
            กรอกเขตพื้นที่เพื่อเพิ่มเข้าระบบ
          </p>
        </div>

        <Link href="/zones">
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 ease-in-out cursor-pointer">
            <CircleChevronLeft size={18} />
            ย้อนกลับ
          </button>
        </Link>
      </div>

      {/* Card Section */}
      {beaconData?.success && scheduleData.success ? (
        <AddZoneForm beacons={beaconData.beacons} schedules={scheduleData.schedules}/>
      ) : (
        <p className="text-red-500">ไม่สามารถโหลดข้อมูลได้</p>
      )}
    </div>
  );
}
