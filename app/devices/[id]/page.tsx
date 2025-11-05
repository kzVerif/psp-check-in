import { getDeviceByStudentId } from "@/actions/device";
import EditDeviceForm from "@/components/EditDeviceForm";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await getDeviceByStudentId(id);

  return (
    <div className="container mx-auto mt-12 px-4">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Edit Devices
          </h1>
          <p className="text-gray-500 mt-1">
            แก้ไขข้อมูลของอุปกรณ์เพื่อเพิ่มเข้าระบบ
          </p>
        </div>

        <Link href="/devices">
          <button className="flex cursor-pointer items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 ease-in-out">
            <CircleChevronLeft size={18} />
            ย้อนกลับ
          </button>
        </Link>
      </div>

      {/* Form Section */}
      <EditDeviceForm device={data.device} />
    </div>
  );
}
