"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// import { addCheckin } from "@/actions/checkins"; // 👈 server action ที่คุณจะเขียนเพิ่ม
import { Search } from "lucide-react";
import { createCheckin } from "@/actions/checkins";

interface Device {
  _id: string;
  name: string;
  student_id: string;
}

interface Zone {
  _id: string;
  room: {
    building: {
      name: string;
    };
    floor: number;
    room_number: string;
  };
}

interface Schedule {
  _id: string;
  course_code: string;
  course_name: string;
}

export default function AddCheckinForm({
  devices,
  zones,
  schedules,
}: {
  devices: Device[];
  zones: Zone[];
  schedules: Schedule[];
}) {
  const [form, setForm] = useState({
    device_id: "",
    zone_id: "",
    schedules_id: "",
    position_x: 0,
    position_y: 0,
    status: "เข้าเรียน",
  });

  const [search, setSearch] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ ตรวจว่ากรอกครบไหม
  if (
    !form.device_id ||
    !form.zone_id ||
    !form.schedules_id ||
    form.position_x === null ||
    form.position_y === null ||
    form.position_x === undefined ||
    form.position_y === undefined
  ) {
    toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    return;
  }

  const payload = {
    device_id: form.device_id,
    zone_id: form.zone_id,
    schedules_id: form.schedules_id,
    position: {
      x: Number(form.position_x),
      y: Number(form.position_y),
    },
    status: form.status,
  };

  console.log(payload);

  toast.promise(createCheckin(payload), {
    loading: "กำลังบันทึก...",
    success: "บันทึกเรียบร้อย!",
    error: "บันทึกล้มเหลว!",
  });
};

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Device dropdown with search */}
        <div>
          <Label>เลือกอุปกรณ์ / นักเรียน</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <Input
              placeholder="ค้นหาชื่อนักเรียน..."
              className="pl-8 mb-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            onValueChange={(val) => setForm({ ...form, device_id: val })}
            value={form.device_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกอุปกรณ์ / นักเรียน" />
            </SelectTrigger>
            <SelectContent>
              {filteredDevices.map((d) => (
                <SelectItem key={d._id} value={d._id}>
                  {d.name} ({d.student_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Zone dropdown */}
        <div>
          <Label>เลือกโซน</Label>
          <Select
            onValueChange={(val) => setForm({ ...form, zone_id: val })}
            value={form.zone_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกโซน" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((z) => (
                <SelectItem key={z._id} value={z._id}>
                  {z.room.building.name} ชั้น {z.room.floor} ห้อง{" "}
                  {z.room.room_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schedule dropdown */}
        <div>
          <Label>เลือกรายวิชา</Label>
          <Select
            onValueChange={(val) => setForm({ ...form, schedules_id: val })}
            value={form.schedules_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกรายวิชา" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.course_code} - {s.course_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>ตำแหน่ง X</Label>
            <Input
              type="number"
              value={form.position_x}
              onChange={(e) =>
                setForm({ ...form, position_x: e.target.valueAsNumber })
              }
            />
          </div>
          <div>
            <Label>ตำแหน่ง Y</Label>
            <Input
              type="number"
              value={form.position_y}
              onChange={(e) =>
                setForm({ ...form, position_y: e.target.valueAsNumber })
              }
            />
          </div>
        </div>

        {/* Status dropdown */}
        <div >
          <Label>สถานะ</Label>
          <Select
            onValueChange={(val) => setForm({ ...form, status: val })}
            value={form.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="เข้าเรียน">เข้าเรียน</SelectItem>
              <SelectItem value="สาย">สาย</SelectItem>
              <SelectItem value="ขาด">ขาด</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          บันทึกการลงชื่อ
        </Button>
      </form>
    </div>
  );
}
