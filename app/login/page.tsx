"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });
    if (res?.ok) router.push("/");
    else alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">🔐 เข้าสู่ระบบ</h1>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded p-2"
        />
        <button type="submit" className="w-full bg-[#3366FF] text-white rounded p-2 hover:bg-gradient-to-br from-[#3001ca] to-[#00eaff]
">
          Login
        </button>
      </form>
    </div>
  );
}
