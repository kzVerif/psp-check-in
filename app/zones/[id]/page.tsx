import { getAllBeaconForZone } from "@/actions/beacons";
import { getAllSchedulesForZone } from "@/actions/schedules";
import { getZoneById, getZonesPolygonAndRoom, zoneById } from "@/actions/zones";
import { Zone } from "@/components/AddBeaconForm";
import EditZoneForm from "@/components/EditZoneForm";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

interface ZoneData {
  success: boolean;
  zones: zoneById | null
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const zoneData: ZoneData = await getZoneById(id);
  const beaconData = await getAllBeaconForZone();
  const scheduleData = await getAllSchedulesForZone();

  return (
    <div className="container mx-auto mt-12 px-4">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Edit Zones
          </h1>
          <p className="text-gray-500 mt-1">
            แก้ไขเขตพื้นที่เพื่อเพิ่มเข้าระบบ
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
      {zoneData?.success ? (
        <EditZoneForm beacons={beaconData.beacons} schedules={scheduleData.schedules} zone={zoneData.zones} />
      ) : (
        <p className="text-red-500">ไม่สามารถโหลดข้อมูลโซนได้</p>
      )}
    </div>
  );
}
