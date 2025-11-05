"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { addSchedules } from "@/actions/schedules";
// import { addSchedule } from "@/actions/schedules"; // 👈 เปลี่ยนเป็น schedules จริง

export interface Zone {
  _id: string;
  room: {
    _id: string;
    building: { name: string } | string;
    floor: number;
    room_number: string;
  };
}

export default function AddSchedulesForm({ zones }: { zones: Zone[] }) {
  const [form, setForm] = useState({
    course_code: "",
    course_name: "",
    semester: "",
  });

  const [time, setTime] = useState([
    { day_of_week: 0, start_time: "", end_time: "" },
  ]);

  const [selectedZoneId, setSelectedZoneId] = useState<string>("none");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSessionChange = (
    index: number,
    field: keyof (typeof time)[0],
    value: string | number
  ) => {
    const newSessions = [...time];
    newSessions[index][field] = value as never;
    setTime(newSessions);
  };

  const handleAddSession = () => {
    setTime([...time, { day_of_week: 0, start_time: "", end_time: "" }]);
  };

  const handleRemoveSession = (index: number) => {
    const newSessions = time.filter((_, i) => i !== index);
    setTime(newSessions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { ...form, zone_id: selectedZoneId, time };
    // console.log(payload);
    toast.promise(addSchedules(payload), {
      loading: "กำลังบันทึก...",
      success: (data) => data.message || "บันทึกเรียบร้อย!",
      error: (err) => err.message || "บันทึกล้มเหลว!",
    });
  };

  const getBuildingName = (b: Zone["room"]["building"]) =>
    typeof b === "object" ? b.name : b;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-center">เพิ่มรายวิชา</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="space-y-2">
          <Label>รหัสวิชา</Label>
          <input
            type="text"
            name="course_code"
            value={form.course_code}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="254374-5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>ชื่อวิชา</Label>
          <input
            type="text"
            name="course_name"
            value={form.course_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="โครงงานคอมพิวเตอร์"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>ปีการศึกษา</Label>
          <input
            type="text"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="1/2568"
            required
          />
        </div>

        {/* Sessions */}
        <div className="space-y-3">
          <Label>เวลาสอน</Label>
          {time.map((session, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 ">
              <div>
                <Label>วัน</Label>
                <input
                  type="number"
                  value={session.day_of_week}
                  onChange={(e) =>
                    handleSessionChange(index, "day_of_week", +e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="0-6"
                />
              </div>
              <div>
                <Label>เริ่ม</Label>
                <input
                  type="text"
                  value={session.start_time}
                  onChange={(e) =>
                    handleSessionChange(index, "start_time", e.target.value)
                  }
                  placeholder="08:00"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <Label>จบ</Label>
                <input
                  type="text"
                  value={session.end_time}
                  onChange={(e) =>
                    handleSessionChange(index, "end_time", e.target.value)
                  }
                  placeholder="10:00"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ปุ่มลบ */}
              {time.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSession(index)}
                  className="text-red-500 text-sm mt-2 col-span-3"
                >
                  ลบเวลานี้
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={handleAddSession}
            className="w-full bg-gray-200 text-black hover:bg-gray-300 mt-2"
          >
            เพิ่มเวลาสอน
          </Button>
        </div>

        {/* Zone Select */}
        <div className="space-y-2">
          <Label>ห้องเรียน</Label>
          <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
            <SelectTrigger id="zone" className="w-full">
              <SelectValue placeholder="เลือกหมายเลขห้อง" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">ไม่ระบุห้อง</SelectItem>
              {zones.length ? (
                zones.map((z) => (
                  <SelectItem key={z._id} value={z._id}>
                    {z.room.room_number} ({getBuildingName(z.room.building)},
                    ชั้น {z.room.floor})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled>
                  ไม่มีห้องให้เลือก
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          บันทึกตารางเรียน
        </Button>
      </form>
    </div>
  );
}
