import { MapPin, MapPinCheckInside, Smartphone } from "lucide-react";
import Avatar from "boring-avatars";
import { getDashBoardData } from "@/actions/dashboard";

export default async function Home() {
  const data = await getDashBoardData();

  return (
    <div className="container mt-10">
      <div className="mb-8">
        <h1 className="text-4xl font-medium">Dashboard</h1>
        <h2 className="">ภาพรวมระบบ</h2>
      </div>

      {/* CARD SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 ">
        <div className="bg-white rounded-xl w-full flex gap-5 px-8 py-4 items-center shadow">
          <div className="text-blue-600 bg-blue-100 p-2 rounded-xl">
            <MapPin size={32} />
          </div>
          <div className="flex-col items-center">
            <h1 className="text-lg">จำนวนโซน</h1>
            <h2 className="text-3xl font-medium">{data.zonesCount}</h2>
          </div>
        </div>
        <div className="bg-white rounded-xl w-full flex gap-5 px-8 py-4 items-center shadow">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-xl">
            <Smartphone size={32} />
          </div>
          <div className="flex-col items-center">
            <h1 className="text-lg">จำนวนอุปกรณ์</h1>
            <h2 className="text-3xl font-medium">{data.devicesCount}</h2>
          </div>
        </div>
        <div className="bg-white rounded-xl w-full flex gap-5 px-8 py-4 items-center shadow">
          <div className="text-violet-600 bg-violet-100 p-2 rounded-xl">
            <MapPinCheckInside size={32} />
          </div>
          <div className="flex-col items-center">
            <h1 className="text-lg">จำนวนเช็คอินทั้งหมด</h1>
            <h2 className="text-3xl font-medium">{data.checkinsCount}</h2>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full bg-white rounded-xl shadow p-6 gap-y-4">
        <h1 className="text-2xl font-medium mb-8">การเช็คชื่อล่าสุด</h1>

        <div className="flex flex-col gap-y-3">
          {data.recentCheckins.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              ยังไม่มีข้อมูลการเช็คชื่อ
            </p>
          ) : (
            data.recentCheckins.map((checkin: any) => (
              <div
                key={checkin._id}
                className="flex items-center justify-between px-8 py-4 rounded-xl bg-gray-50"
              >
                <div className="flex items-center gap-5">
                  <Avatar
                    name={checkin.device_id?.name || "ไม่ทราบชื่อ"}
                    variant="beam"
                  />
                  <div className="flex-col items-center">
                    <h1 className="font-medium text-lg">
                      {checkin.device_id?.name || "ไม่ทราบชื่อ"}
                    </h1>
                    <h2>
                      {checkin.schedules_id?.course_name ||
                        checkin.schedules_id?.course_code ||
                        "ไม่ทราบวิชา"}
                    </h2>
                  </div>
                </div>
                <span
                  className={`${
                    checkin.status === "เข้าเรียน"
                      ? "text-emerald-600 bg-emerald-100"
                      : checkin.status === "สาย"
                      ? "text-yellow-600 bg-yellow-100"
                      : "text-red-600 bg-red-100"
                  } py-2 px-4 rounded-2xl`}
                >
                  {checkin.status === "เข้าเรียน"
                    ? "เข้าเรียน"
                    : checkin.status === "LATE"
                    ? "สาย"
                    : "ขาดเรียน"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
