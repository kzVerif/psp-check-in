import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Checkins, Devices, Schedules } from "@/models/mongoModel";

// ✅ ตอบ Preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,device_id",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { device_id, student_id, bluetooth_devices, course_id, timestamp, sign } =
      await req.json();
    const s_now = Date.now();

    // ✅ ตรวจ timestamp ไม่เกิน 5 นาที
    const diff = Math.abs(s_now - Number(timestamp));
    if (diff > 5 * 60 * 1000) {
      return NextResponse.json(
        { success: false, message: "หมดเวลาทำรายการ (Request expired)" },
        { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ โหลด key จาก env
    const key = process.env.SECRET_SIGNATURE;
    if (!key) {
      console.error("Missing SECRET_SIGNATURE env");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ สร้าง HMAC ฝั่ง server
    const message = `${device_id}#${student_id}#${course_id}#${timestamp}`;
    const signServer = crypto
      .createHmac("sha256", key)
      .update(message)
      .digest("hex");

    // ✅ ตรวจสอบความถูกต้องของ signature
    if (sign !== signServer) {
      return NextResponse.json(
        { success: false, message: "Signature ไม่ถูกต้อง" },
        { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    await connectDB();
    // console.log(device_id);
    
    const device = await Devices.findOne({ device_id });
    if (!device) {
      return NextResponse.json(
        { success: false, message: "ไม่พบอุปกรณ์ที่ระบุ" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (!device_id || !student_id) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุ device_id และ student_id" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const course = await Schedules.findById(course_id).populate({
      path: "zone_id",
      select: "beacons",
      populate: [{ path: "beacons", select: "label mac_address" }],
    });
    if (!course) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตารางเรียนที่ระบุ" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const now = new Date();
    const start = new Date();
    const end = new Date();

    // ✅ ตรวจเวลาเรียน
    for (const time of course.time) {
      if (now.getDay() === time.day_of_week) {
        const sTime = time.start_time.split(":");
        const eTime = time.end_time.split(":");
        start.setHours(Number(sTime[0]), Number(sTime[1]));
        end.setHours(Number(eTime[0]), Number(eTime[1]));
        if (!(start <= now && now <= end)) {
          return NextResponse.json(
            { success: false, message: "เช็คชื่อไม่สำเร็จ กรุณาอยู่ในวันและเวลาที่กำหนด" },
            { headers: { "Access-Control-Allow-Origin": "*" } }
          );
        }
      }
    }

    // ✅ ตรวจว่าเช็คชื่อไปแล้วหรือยัง
    const isCheckin = await Checkins.findOne({
      device_id: device._id,
      $and: [
        { schedules_id: course._id },
        { timestamp: { $gte: start, $lte: end } },
      ],
    });

    if (isCheckin) {
      return NextResponse.json(
        { success: false, message: "คุณได้เช็คชื่อไปแล้ว" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ ตรวจสัญญาณ Beacon
    let matchCount = 0;
    for (const bt of bluetooth_devices) {
      for (const beacon of course.zone_id.beacons) {
        if (bt === beacon.mac_address) {
          matchCount++;
        }
      }
    }

    if (matchCount < 2) {
      return NextResponse.json(
        { success: false, message: "เช็คชื่อไม่สำเร็จ กรุณาอยู่ในห้องเรียน" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    await Checkins.create({
      position: { x: 5, y: 5 },
      status: "เข้าเรียน",
      schedules_id: course._id,
      zone_id: course.zone_id._id,
      device_id: device._id,
    });

    return NextResponse.json(
      { success: true, message: "เช็คชื่อสำเร็จ ✅" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error: any) {
    console.error("❌ Error in /checkin POST:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ", error: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.headers.get("device_id");
    // console.log(id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing device_id header" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    await connectDB();
    const checkins = await Checkins.find({
      device_id: new mongoose.Types.ObjectId(id), 
    })
      .select("status schedules_id")
      .populate({
        path: "schedules_id",
        select: "course_code course_name semester",
      })
      .limit(5);

    return NextResponse.json(
      { success: true, checkins },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

