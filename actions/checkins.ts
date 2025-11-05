"use server";
import { connectDB } from "@/lib/mongodb";
import { Checkins } from "@/models/mongoModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export interface ICheckins {
  _id: string;
  position: { x: number; y: number };
  status: string;
  timestamp: Date;
  zone_id: {
    _id: string;
    room: {
      building: { code: string; name: string };
      floor: number;
      room_number: string;
    };
  };
  device_id: {
    _id: string;
    student_id: string;
    name: string;
  };
  schedules: {
    _id: string;
    course_code: string;
    course_name: string;
  };
  __v: number;
}

export async function getAllCheckins() {
  try {
    await connectDB();
    const checkins = await Checkins.find()
      .populate({
        path: "zone_id",
        select: "room",
      })
      .populate({
        path: "device_id",
        select: "student_id name",
      })
      .populate({
        path: "schedules_id",
        select: "course_code course_name",
      })
      .lean();

    // console.log(checkins);

    const safeCheckins: ICheckins[] = checkins.map((c: any) => ({
      _id: c._id.toString(),
      position: { x: c.position.x, y: c.position.y },
      status: c.status,
      timestamp: c.timestamp,
      zone_id: {
        _id: c.zone_id._id.toString(),
        room: {
          building: {
            code: c.zone_id.room.building.code,
            name: c.zone_id.room.building.name,
          },
          floor: c.zone_id.room.floor,
          room_number: c.zone_id.room.room_number,
        },
      },
      device_id: {
        _id: c.device_id._id.toString(),
        student_id: c.device_id.student_id,
        name: c.device_id.name,
      },
      schedules: {
        _id: c.schedules_id._id.toString(),
        course_code: c.schedules_id.course_code,
        course_name: c.schedules_id.course_name,
      },
      __v: c.__v,
    }));

    return {
      succes: true,
      checkins: safeCheckins,
    };
  } catch (error) {
    console.log(error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Checkins");
  }
}

export async function deleteCheckin(id: string) {
  try {
    await connectDB();
    const del = await Checkins.findOneAndDelete(
      new mongoose.Types.ObjectId(id)
    );
    if (!del) {
      throw new Error("ไม่พบการลงชื่อนี้ในระบบ");
    }

    revalidatePath("/checkins");
    return {
      success: true,
      message: "ลบการลงชื่อสำเร็จ",
    };
  } catch (error) {
    throw new Error("ไม่สามมารถลบการลงชื่อนี้ได้");
  }
}

export async function createCheckin(data: any) {
  try {
    await connectDB();

    const newCheckin = await Checkins.create({
      device_id: new mongoose.Types.ObjectId(data.device_id),
      zone_id: new mongoose.Types.ObjectId(data.zone_id),
      schedules_id: new mongoose.Types.ObjectId(data.schedules_id),
      position: {
        x: data.position.x,
        y: data.position.y,
      },
      status: data.status,
      timestamp: new Date(), // ✅ เพิ่ม timestamp ตอนสร้าง (optional)
    });

    revalidatePath("/checkins")
    return {
      success: true,
      message: "บันทึกการลงชื่อเรียบร้อย",
    };
  } catch (error: any) {
    console.error("❌ Create Checkin Error:", error);
    throw new Error("ไม่สามารเพิ่มการเช็คอินได้");
  }
}
