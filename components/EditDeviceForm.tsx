"use client";
import React, { useState, useEffect } from "react";
import { addDevice, updateDeviceByStudentId } from "@/actions/device";
import { toast } from "sonner";

export default function EditDeviceForm({ device }: { device: any }) {
  const [form, setForm] = useState({
    device_id: device.device_id,
    student_id: device.student_id,
    name: device.name,
    // password: "",
  });

  useEffect(() => {
    if (device) {
      setForm({
        device_id: device.device_id || "",
        student_id: device.student_id || "",
        name: device.name || "",
        // password: "",
      });
    }
  }, [device]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(updateDeviceByStudentId(device.student_id,form), {
      loading: "กำลังบันทึก...",
      success: (data) => data.message || "บันทึกเรียบร้อย!",
      error: (err) => err.message || "บันทึกล้มเหลว!",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl mb-4">อุปกรณ์ของ {device.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block mb-2 text-sm font-medium">เลขอุปกรณ์</label>
        <input
          type="text"
          name="device_id"
          value={form.device_id}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="AA:BB:CC:DD:EE:66"
          required
        />

        <label className="block mb-2 text-sm font-medium">รหัสนิสิต</label>
        <input
          type="text"
          name="student_id"
          value={form.student_id}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="663333256"
          required
        />

        <label className="block mb-2 text-sm font-medium">ชื่อนามสกุล</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="สุดหล่อ ต่อยตึง"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md cursor-pointer"
        >
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}
