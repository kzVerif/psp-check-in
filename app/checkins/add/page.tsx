import { getAllDevices } from "@/actions/device";
import { getAllSchedules } from "@/actions/schedules";
import { getZonesPolygonAndRoom } from "@/actions/zones";
import AddBeaconForm, { Zone } from "@/components/AddBeaconForm";
import AddCheckinForm from "@/components/AddCheckinForm";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

interface ZoneData {
  success: boolean;
  zones: Zone[];
}

export default async function Page() {
  const devices = await getAllDevices();
  const zones = await getZonesPolygonAndRoom();
  const schedules = await getAllSchedules();

  return (
    <div className="container mx-auto mt-12 px-4">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Add Checkins
          </h1>
          <p className="text-gray-500 mt-1">
            กรอกข้อมูลการลงชื่อเพื่อเพิ่มเข้าระบบ
          </p>
        </div>

        <Link href="/checkins">
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 ease-in-out cursor-pointer">
            <CircleChevronLeft size={18} />
            ย้อนกลับ
          </button>
        </Link>
      </div>

      {/* Card Section */}
      <AddCheckinForm
        devices={devices.devices}
        zones={zones.zones}
        schedules={schedules.schedules}
      />
    </div>
  );
}
