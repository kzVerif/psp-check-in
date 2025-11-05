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
import { addBeacon, IBeacons, updateBeaconById } from "@/actions/beacons";

export interface Zone {
  _id: string;
  room: {
    _id: string;
    building: { name: string } | string;
    floor: number;
    room_number: string;
  };
}

export default function EditBeaconForm({
  beacon,
  zones,
}: {
  beacon: IBeacons | null;
  zones: Zone[];
}) {
  const [form, setForm] = useState({
    label: beacon?.label,
    mac_address: beacon?.mac_address,
    x: beacon?.x,
    y: beacon?.y,
  });

  console.log(beacon?.zone_id?._id);
  // ✅ เก็บ zone ที่เลือก (จาก dropdown)
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    beacon?.zone_id?._id || "none"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beacon?._id) {
      toast.error("ไม่พบ ID ของอุปกรณ์นี้");
      return;
    }

    // ตัวอย่าง payload ที่จะส่งต่อไปยัง action / API
    const payload = { ...form, zone_id: selectedZoneId };
    console.log(payload);
    toast.promise(updateBeaconById(beacon?._id, payload), {
      loading: "กำลังบันทึก...",
      success: (data) => data.message || "บันทึกเรียบร้อย!",
      error: (err) => err.message || "บันทึกล้มเหลว!",
    });
  };

  const getBuildingName = (b: Zone["room"]["building"]) =>
    typeof b === "object" ? b.name : b;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        แก้ไขอุปกรณ์บลูทูธ {beacon?.label}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="This is Beacon"
            required
          />
        </div>

        {/* MAC Address */}
        <div className="space-y-2">
          <Label htmlFor="mac_address">MAC Address</Label>
          <input
            type="text"
            name="mac_address"
            value={form.mac_address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="AA:BB:CC:DD:66"
            required
          />
        </div>

        {/* X & Y */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x">ตำแหน่ง X</Label>
            <input
              type="number"
              name="x"
              value={form.x}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="y">ตำแหน่ง Y</Label>
            <input
              type="number"
              name="y"
              value={form.y}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="5"
              required
            />
          </div>
        </div>

        {/* ✅ Dropdown: map จาก zones */}
        <div className="space-y-2">
          <Label htmlFor="zone">หมายเลขห้อง</Label>
          <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
            <SelectTrigger id="zone" className="w-full">
              <SelectValue placeholder="เลือกหมายเลขห้อง" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">ไม่ระบุห้อง</SelectItem>
              {zones?.length ? (
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
          บันทึกการแก้ไข
        </Button>
      </form>
    </div>
  );
}
