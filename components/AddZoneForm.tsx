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
import {  zoneSchedules } from "@/actions/schedules";
import { zoneBeacons } from "@/actions/beacons";
import { addZone } from "@/actions/zones";

export default function AddZoneForm({
  beacons,
  schedules,
}: {
  beacons: zoneBeacons[];
  schedules: zoneSchedules[];
}) {
  const [form, setForm] = useState({
    building_code: "",
    building_name: "",
    floor: "",
    room_number: "",
    beacons: [] as string[],
    schedule: "", // ✅ ตารางเรียนเลือกได้อันเดียว
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const payload = {
      room: {
        building: {
          code: form.building_code,
          name: form.building_name,
        },
        floor: Number(form.floor),
        room_number: form.room_number,
      },
      beacons: form.beacons,
      chedules: form.schedule==="none" ? null : form.schedule,// ✅ ตารางเรียนเดียว แต่ส่งเป็น array
    };

    console.log("📦 Payload:", payload);

    toast.promise(addZone(payload), {
      loading: "กำลังบันทึก...",
      success: (data) => data.message || "บันทึกเรียบร้อย!",
      error: (err) => err.message || "บันทึกล้มเหลว!",
    });
  };

  // ✅ เพิ่ม Beacon ทีละตัว
  const handleAddBeacon = (id: string) => {
    if (id && !form.beacons.includes(id)) {
      setForm((prev) => ({ ...prev, beacons: [...prev.beacons, id] }));
    }
  };

  const handleRemoveBeacon = (id: string) => {
    setForm((prev) => ({
      ...prev,
      beacons: prev.beacons.filter((b) => b !== id),
    }));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        เพิ่มเขตพื้นที่ (Zone)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 🏢 Building Info */}
        <div className="space-y-2">
          <Label>รหัสตึก (Building Code)</Label>
          <input
            type="text"
            name="building_code"
            value={form.building_code}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="SCI"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>ชื่อตึก (Building Name)</Label>
          <input
            type="text"
            name="building_name"
            value={form.building_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Science Building"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>ชั้น (Floor)</Label>
          <input
            type="number"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="2"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>หมายเลขห้อง (Room Number)</Label>
          <input
            type="text"
            name="room_number"
            value={form.room_number}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="SC201"
            required
          />
        </div>

        {/* 📡 Beacons Dropdown + ปุ่มเพิ่ม */}
        <div className="space-y-2">
          <Label>เลือก Beacon</Label>
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(val) => handleAddBeacon(val)}
              value=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือก Beacon เพื่อเพิ่ม" />
              </SelectTrigger>
              <SelectContent>
                {beacons.map((b) => (
                  <SelectItem key={b._id} value={b._id}>
                    {b.label} ({b.mac_address})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* แสดงรายการ Beacon ที่เลือกแล้ว */}
          {form.beacons.length > 0 && (
            <div className="border p-2 rounded-md mt-2 bg-gray-50">
              <Label className="text-sm text-gray-700">Beacons ที่เลือกแล้ว</Label>
              <ul className="mt-1 space-y-1 text-sm">
                {form.beacons.map((id) => {
                  const b = beacons.find((x) => x._id === id);
                  if (!b) return null;
                  return (
                    <li
                      key={b._id}
                      className="flex justify-between items-center bg-white border rounded-md px-2 py-1"
                    >
                      <span>
                        {b.label} ({b.mac_address})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBeacon(b._id)}
                        className="text-red-500 text-xs"
                      >
                        ลบ
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* 🕓 Schedule dropdown (เลือกได้อันเดียว) */}
        <div className="space-y-2">
          <Label>เลือกตารางเรียน (Schedule)</Label>
          <Select
            value={form.schedule}
            onValueChange={(val) => setForm({ ...form, schedule: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกตารางเรียน" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">ไม่เลือกตารางเรียน</SelectItem>
              {schedules.length ? (
                schedules.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.course_name} ({s.course_code}) - {s.semester}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="__empty">
                  ไม่มีตารางเรียน
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          บันทึกเขตพื้นที่
        </Button>
      </form>
    </div>
  );
}
