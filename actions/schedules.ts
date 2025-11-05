"use server";
import { connectDB } from "@/lib/mongodb";
import { Schedules } from "@/models/mongoModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

interface Zones {
  _id: string;
  room: {
    floor: number;
    room_number: string;
    building: {
      code: string;
      name: string;
    };
  };
}

export interface ISchedules {
  _id: string;
  course_code: string;
  course_name: string;
  semester: string;
  time: [
    {
      day_of_week: number;
      start_time: string;
      end_time: string;
    }
  ];
  __v: number;
  zone_id: Zones | null;
}

export async function getAllSchedules() {
  try {
    await connectDB();
    const schedules = await Schedules.find()
      .populate({
        path: "zone_id",
        select: "room",
      })
      .lean();

    if (!schedules) {
      throw new Error("ไม่พบข้อมูลตารางสอนในระบบ");
      // return {
      //   success: false,
      //   schedules: [],
      // };
    }

    const safeSchedules: ISchedules[] = schedules.map((b: any) => ({
      _id: b._id.toString(),
      course_code: b.course_code,
      course_name: b.course_name,
      semester: b.semester,
      time: b.time?.map((t: any) => ({
        day_of_week: t.day_of_week ?? 0,
        start_time: t.start_time ?? "",
        end_time: t.end_time ?? "",
      })),
      __v: b.__v,
      zone_id: b.zone_id
        ? {
            _id: b.zone_id._id.toString(),
            room: {
              floor: b.zone_id.room?.floor ?? 0,
              room_number: b.zone_id.room?.room_number ?? "",
              building: {
                code: b.zone_id.room?.building?.code ?? "",
                name: b.zone_id.room?.building?.name ?? "",
              },
            },
          }
        : null,
    }));

    return {
      success: true,
      schedules: safeSchedules,
    };
  } catch (error) {
    console.log(error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลตารางสอน");
    // return {
    //   success: false,
    //   schedules: [],
    // };
  }
}

export async function addSchedules(data: any) {
  try {
    await connectDB();

    if (!data.course_code || !data.course_name || !data.semester) {
      throw new Error("กรุณากรอกข้อมูลวิชาให้ครบถ้วน");
      // return { success: false, message: "กรุณากรอกข้อมูลวิชาให้ครบถ้วน" };
    }

    if (!Array.isArray(data.time) || data.time.length === 0) {
      throw new Error("ต้องมีเวลาเรียนอย่างน้อย 1 ช่วงเวลา");
      // return { success: false, message: "ต้องมีเวลาเรียนอย่างน้อย 1 ช่วงเวลา" };
    }

    const zone =
      data.zone_id && data.zone_id !== "none"
        ? new mongoose.Types.ObjectId(data.zone_id)
        : null;

    await Schedules.create({
      course_code: data.course_code,
      course_name: data.course_name,
      semester: data.semester,
      time: data.time.map((t: any) => ({
        day_of_week: Number(t.day_of_week),
        start_time: t.start_time,
        end_time: t.end_time,
      })),
      zone_id: zone,
    });

    revalidatePath("/schedules");

    return {
      success: true,
      message: "เพิ่มวิชาที่สอนสำเร็จ ✅",
    };
  } catch (error: any) {
    console.error("❌ addSchedules error:", error);
    throw new Error(error.message || "ไม่สามารถเพิ่มรายวิชาที่สอนได้");
    // return {
    //   success: false,
    //   message: "ไม่สามารถเพิ่มรายวิชาที่สอนได้",
    // };
  }
}

export async function deleteSchedulesById(id: string) {
  try {
    await connectDB();
    const del = await Schedules.findByIdAndDelete(id);
    if (!del) {
      throw new Error("ไม่พบวิชานี้ในระบบ");
      // return { success: false, message: "ไม่พบวิชานี้ในระบบ" };
    }
    revalidatePath("/schedlues");
    return {
      success: true,
      message: "ลบรายวิชาสำเร็จ",
    };
  } catch (error: any) {
    console.error("❌ deleteSchedules error:", error);
    throw new Error(error.message || "ไม่สามารถลบรายวิชาได้");
    // return {
    //   success: false,
    //   message: "ไม่สามารถลบรายวิชาได้",
    // };
  }
}

export async function getScheduleById(id: string) {
  try {
    await connectDB();

    const schedule = await Schedules.findById<ISchedules>(
      new mongoose.Types.ObjectId(id)
    )
      .populate({
        path: "zone_id",
        select: "room",
      })
      .lean();

    if (!schedule) {
      throw new Error("ไม่พบตารางเรียนนี้ในระบบ");
      // return { success: false, schedule: null };
    }

    const s = schedule as any;
    const safeSchedule: ISchedules = {
      _id: s._id.toString(),
      course_code: s.course_code,
      course_name: s.course_name,
      semester: s.semester ?? "",
      time: s.time?.map((t: any) => ({
        day_of_week: t.day_of_week ?? 0,
        start_time: t.start_time ?? "",
        end_time: t.end_time ?? "",
      })),
      __v: s.__v ?? 0,
      zone_id: s.zone_id
        ? {
            _id: s.zone_id._id.toString(),
            room: {
              floor: s.zone_id.room?.floor ?? 0,
              room_number: s.zone_id.room?.room_number ?? "",
              building: {
                code: s.zone_id.room?.building?.code ?? "",
                name: s.zone_id.room?.building?.name ?? "",
              },
            },
          }
        : null,
    };

    return {
      success: true,
      schedule: safeSchedule,
    };
  } catch (error: any) {
    console.error("❌ Error in getScheduleById:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลตารางสอน");
    // return {
    //   success: false,
    //   schedule: null,
    // };
  }
}

export async function updateScheduleById(id: string, data: any) {
  try {
    await connectDB();

    const updated = await Schedules.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: data }
    );
    if (!updated) {
      throw new Error("ไม่พบวิชาที่สอน");
      // return {
      //   success: false,
      //   message: "ไม่พบวิชาที่สอน",
      // };
    }

    return {
      success: true,
      message: "แก้ไขวิชาที่สอนสำเร็จ",
    };
  } catch (error: any) {
    console.error("❌ updateSchedule error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการอัปเดตวิชาที่สอน");
    // return {
    //   success: false,
    //   message: "ไม่วิชาที่สอน",
    // };
  }
}

export interface zoneSchedules {
  _id: string;
  course_code: string;
  course_name: string;
  semester: string;
}

export async function getAllSchedulesForZone() {
  try {
    await connectDB();
    const schedules = await Schedules.find()
      .select("course_code course_name semester")
      .lean();

    if (!schedules) {
      throw new Error("ไม่พบข้อมูลตารางสอนในระบบ");
      // return {
      //   success: false,
      //   schedules: [],
      // };
    }

    const safeSchedules: zoneSchedules[] = schedules.map((s: any) => ({
      _id: s._id.toString(),
      course_code: s.course_code,
      course_name: s.course_name,
      semester: s.semester,
    }));

    return {
      success: true,
      schedules: safeSchedules,
    };
  } catch (error) {
    console.log(error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลตารางสอนสำหรับ Zone");
    // return {
    //   success: false,
    //   schedules: [],
    // };
  }
}
