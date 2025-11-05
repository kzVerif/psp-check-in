"use client";

import { addDevice } from "@/actions/device";
import { useState } from "react";
import { toast } from "sonner";
export default function AddDeviceForm() {
  const [form, setForm] = useState({
    device_id: "",
    student_id: "",
    name: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(addDevice(form), {
      loading: 'กำลังบันทึก...',
      success: (data) => data.message || 'บันทึกเรียบร้อย!',
      error: (err) => err.message || 'บันทึกล้มเหลว!',
    })
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl mb-4">เพิ่มอุปกรณ์</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="block mb-2 text-sm font-medium">เลขอุปกรณ์</h1>
        <input
          type="text"
          name="device_id"
          value={form.device_id}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="AA:BB:CC:DD:EE:66"
          required
        />

        <h1 className="block mb-2 text-sm font-medium">รหัสนิสิต</h1>
        <input
          type="text"
          name="student_id"
          value={form.student_id}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="663333256"
          required
        />

        <h1 className="block mb-2 text-sm font-medium">ชื่อนามสกุล</h1>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="สุดหล่อ ต่อยตึง"
          required
        />

        <h1 className="block mb-2 text-sm font-medium">รหัสผ่าน</h1>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="Strongpassword"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md cursor-pointer"
        >
          เพิ่มอุปกรณ์
        </button>
      </form>
    </div>
  );
}
