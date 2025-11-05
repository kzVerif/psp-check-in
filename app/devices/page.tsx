import ManageDevice from "@/components/ManageDevice";
import { CirclePlus } from "lucide-react";
import Link from "next/dist/client/link";
import { getAllDevices } from "@/actions/device";

export default async function page() {
  const { devices } = await getAllDevices();
  return (
    <div className="container mt-10 ">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-medium">Devices</h1>
          <h2 className="">จัดการอุปกรณ์</h2>
        </div>
        <Link href={"/devices/add"}>
          <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer ease-in-out duration-300">
            <CirclePlus size={18} /> เพิ่มอุปกรณ์
          </button>
        </Link>
      </div>
      <ManageDevice devices={devices}/>
    </div>
  );
}
