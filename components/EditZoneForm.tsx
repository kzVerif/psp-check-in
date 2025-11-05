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
import { zoneSchedules } from "@/actions/schedules";
import { zoneBeacons } from "@/actions/beacons";
import { addZone, updateZoneById, zoneById } from "@/actions/zones";

export default function EditZoneForm({
  beacons,
  schedules,
  zone,
}: {
  beacons: zoneBeacons[];
  schedules: zoneSchedules[];
  zone: zoneById | null;
}) {
  if (!zone) {
    return <div className="text-center">ไม่พบข้อมูล Zones</div>;
  }
  const [form, setForm] = useState({
    building_code: zone.room.building.code,
    building_name: zone.room.building.name,
    floor: zone.room.floor,
    room_number: zone.room.room_number,
    beacons: zone.beacons.map((b: any) => b._id),
    schedule: zone.schedules || "none",
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
      schedules: form.schedule === "none" ? null : form.schedule,
    };
    
    toast.promise(updateZoneById(zone._id,payload), {
      loading: "กำลังบันทึก...",
      success: (data) => data.message || "บันทึกเรียบร้อย!",
      error: (err) => err.message || "บันทึกล้มเหลว!",
    });
  };

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
        แก้ไขเขตพื้นที่ (Zone)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 🏢 Building Info */}
        {["building_code", "building_name", "floor", "room_number"].map(
          (field, i) => (
            <div key={i} className="space-y-2">
              <Label>
                {field === "building_code"
                  ? "รหัสตึก (Building Code)"
                  : field === "building_name"
                  ? "ชื่อตึก (Building Name)"
                  : field === "floor"
                  ? "ชั้น (Floor)"
                  : "หมายเลขห้อง (Room Number)"}
              </Label>
              <input
                type={field === "floor" ? "number" : "text"}
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )
        )}

        {/* 📡 Beacons */}
        <div className="space-y-2">
          <Label>เลือก Beacon</Label>
          <Select onValueChange={handleAddBeacon} value="">
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

          {form.beacons.length > 0 && (
            <div className="border p-2 rounded-md mt-2 bg-gray-50">
              <Label className="text-sm text-gray-700">
                Beacons ที่เลือกแล้ว
              </Label>
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

        {/* 🕓 Schedule dropdown */}
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
