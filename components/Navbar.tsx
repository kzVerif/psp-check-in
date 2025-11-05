"use client";

import { CircleCheckBig, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* โลโก้ */}
        <Link href={"/"}>
          <div className="flex items-center gap-2 cursor-pointer">
            <CircleCheckBig size={26} className="text-indigo-600" />
            <h1 className="text-xl font-medium text-gray-800">
              ระบบจัดการการเข้าเรียน
            </h1>
          </div>
        </Link>

        {/* ปุ่มเปิดเมนูมือถือ */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* เมนูหลัก (Desktop) */}
        <div className="hidden md:flex items-center gap-3 text-lg">
          {["zones", "beacons", "schedules", "devices", "checkins"].map((p) => (
            <Link key={p} href={`/${p}`}>
              <button className="px-4 py-2 hover:bg-indigo-100 rounded-2xl transition cursor-pointer">
                {p[0].toUpperCase() + p.slice(1)}
              </button>
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition-all"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* เมนูมือถือ */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white border-t p-4 space-y-2">
          {["zones", "beacons", "schedules", "devices", "checkins"].map((p) => (
            <Link key={p} href={`/${p}`} onClick={() => setMenuOpen(false)}>
              <button className="w-full text-left p-2 hover:bg-indigo-100 rounded-lg cursor-pointer">
                {p[0].toUpperCase() + p.slice(1)}
              </button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
