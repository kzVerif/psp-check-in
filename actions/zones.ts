"use server";
import { connectDB } from "@/lib/mongodb";
import { Zones } from "@/models/mongoModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export interface zoneTable {
  _id: string;
  room: {
    building: {
      code: string;
      name: string;
    };
    floor: number;
    room_number: string;
  };
}

export interface zoneById {
  _id: string;
  room: {
    building: {
      code: string;
      name: string;
    };
    floor: number;
    room_number: string;
  };
  beacons: [];
  schedules: string;
}

export async function getZonesPolygonAndRoom() {
  try {
    await connectDB();

    const zones = await Zones.find()
      .select("room")
      .populate({
        path: "room",
        select: "floor room_number",
      })
      .lean();

    const safeZones = zones.map((z: any) => ({
      ...z,
      _id: z._id.toString(),
      room: z.room
        ? {
            ...z.room,
            _id: z.room._id?.toString() ?? "",
            building:
              typeof z.room.building === "object"
                ? {
                    ...z.room.building,
                  }
                : z.room.building,
          }
        : null,
    }));

    return {
      success: true,
      zones: safeZones,
    };
  } catch (error) {
    console.error("❌ Load zones error:", error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Zones");
    // return {
    //   success: false,
    //   zones: [],
    // };
  }
}

export async function getAllZones() {
  try {
    await connectDB();
    const zones = await Zones.find().select("room").lean();

    if (!zones) {
      throw new Error("ไม่พบข้อมูลโซนในระบบ");
      // return { success: false, zones: [] };
    }

    const safeZones: zoneTable[] = zones.map((z: any) => ({
      _id: z._id.toString(),
      room: {
        building: {
          code: z.room.building.code,
          name: z.room.building.name,
        },
        floor: z.room.floor,
        room_number: z.room.room_number,
      },
    }));

    return {
      success: true,
      zones: safeZones,
    };
  } catch (error) {
    console.log(error);
    throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล Zone ทั้งหมด");
    // return {
    //   success: false,
    //   zones: [],
    // };
  }
}

export async function addZone(data: any) {
  try {
    await connectDB();
    await Zones.create({
      room: {
        building: {
          code: data.room.building.code,
          name: data.room.building.name,
        },
        floor: data.room.floor,
        room_number: data.room.room_number,
      },
      beacons: data.beacons,
      schedules: data.schedules,
      checkins: null,
    });
    return {
      success: true,
      message: "สร้าง zones สำเร็จ",
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "สร้าง zones ไม่สำเร็จ");
    // return {
    //   success: false,
    //   message: "สร้าง zones ไม่สำเร็จ",
    // };
  }
}

export async function deleteZone(id: string) {
  try {
    await connectDB();
    const del = await Zones.findByIdAndDelete(id);
    if (!del) {
      throw new Error("ไม่พบ zone ที่ระบุ");
      // return { success: false, message: "ไม่พบ zone ที่ระบุ" };
    }
    revalidatePath("/zones");
    return {
      success: true,
      message: "ลบ zone สำเร็จ",
    };
  } catch (error: any) {
    console.error("❌ deleteZone error:", error);
    throw new Error(error.message || "ไม่สามารถลบ zone นี้ได้");
    // return {
    //   success: false,
    //   message: "ไม่สามารถ zone นี้ได้",
    // };
  }
}

export async function getZoneById(id: string) {
  try {
    await connectDB();
    const zones: any = await Zones.findById(new mongoose.Types.ObjectId(id))
      .select("room beacons schedules")
      .lean();

    if (!zones) {
      throw new Error("ไม่พบ Zone ที่ระบุ");
      // return { success: false, zones: null };
    }

    const safeZones: zoneById = {
      _id: zones._id.toString(),
      room: {
        building: {
          code: zones.room.building.code,
          name: zones.room.building.name,
        },
        floor: zones.room.floor,
        room_number: zones.room.room_number,
      },
      beacons: zones.beacons.map((b: any) => ({
        _id: b._id.toString(),
      })),
      schedules: "",
    };

    return {
      success: true,
      zones: safeZones,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการดึง Zone ที่ระบุ");
    // return {
    //   success: false,
    //   zones: null,
    // };
  }
}

export async function updateZoneById(id: string, data: any) {
  try {
    await connectDB();
    const updated = await Zones.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: data }
    );
    if (!updated) {
      throw new Error("ไม่พบ Zone ที่ระบุ");
      // return {
      //   success: false,
      //   message: "ไม่พบโซนที่ระบุ",
      // };
    }

    revalidatePath("/zones");
    return {
      success: true,
      message: "แก้ไขโซนสำเร็จ",
    };
  } catch (error: any) {
    throw new Error(error.message || "เกิดข้อผิดพลาดในการแก้ไข Zone");
    // console.log(error);
    // return {
    //   success: false,
    //   message: "ไม่สามารถแก้ไขโซนได้",
    // };
  }
}
