"use server";
import { connectDB } from "@/lib/mongodb";
import { Beacons } from "@/models/mongoModel";
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

export interface IBeacons {
  _id: string;
  label: string;
  mac_address: string;
  x: number;
  y: number;
  zone_id: Zones | null; // ✅ บาง Beacon อาจไม่มี zone
}

export interface zoneBeacons {
  _id: string;
  label: string;
  mac_address: string;
}

export async function getAllBeacons() {
  try {
    await connectDB();

    const beacons = await Beacons.find()
      .populate({
        path: "zone_id",
        select: "room polygon",
      })
      .lean();

    const safeBeacons: IBeacons[] = beacons.map((b: any) => ({
      _id: b._id.toString(),
      label: b.label,
      mac_address: b.mac_address,
      x: b.x,
      y: b.y,
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

    return { success: true, beacons: safeBeacons };
  } catch (error) {
    console.error("Get all beacons error:", error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Beacon");
    // return { success: false, beacons: [] };
  }
}

export async function deleteBeaconById(id: string) {
  try {
    await connectDB();
    const res = await Beacons.findByIdAndDelete(id);
    if (!res) {
      throw new Error("ไม่พบเบคอนนี้ในระบบ");
      // return {
      //   success: false,
      //   message: "ไม่พบเบคอนนี้ในระบบ",
      // };
    }
    revalidatePath("/beacons");
    return {
      success: true,
      message: "ลบเบคอนสำเร็จ",
    };
  } catch (error: any) {
    console.error("Delete beacon error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการลบ Beacon");
    // return {
    //   success: false,
    //   message: "เกิดข้อผิดพลาดในการลบ",
    // };
  }
}

export async function addBeacon(data: any) {
  try {
    await connectDB();
    const res = await Beacons.create({
      label: data.label,
      mac_address: data.mac_address,
      x: data.x,
      y: data.y,
      zone_id:
        data.zone_id && data.zone_id !== "none"
          ? new mongoose.Types.ObjectId(data.zone_id)
          : null,
    });
    revalidatePath("/beacons");
    return {
      success: true,
      message: "เพิ่ม Beacon สำเร็จ",
    };
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error("มี MAC Address นี้อยู่แล้ว");
      // return { success: false, message: "มี MAC Address นี้อยู่แล้ว" };
    }
    console.error("addBeacon error:", error);
    throw new Error("เกิดข้อผิดพลาดในการเพิ่ม Beacon");
    // return { success: false, message: "เกิดข้อผิดพลาดในการเพิ่ม Beacon" };
  }
}

export async function getBeaconsById(id: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
      // return { success: false, message: "Invalid ID format", beacon: null };
    }

    let beacon = await Beacons.findOne({ _id: new mongoose.Types.ObjectId(id) })
      .populate({
        path: "zone_id",
        select: "room polygon",
      })
      .lean<IBeacons | null>();

    if (!beacon) {
      throw new Error("Beacon not found");
      // return { success: false, message: "Beacon not found", beacon: null };
    }

    const safeBeacon: IBeacons = {
      _id: beacon._id.toString(),
      label: beacon.label,
      mac_address: beacon.mac_address,
      x: beacon.x,
      y: beacon.y,
      zone_id: beacon.zone_id
        ? {
            _id: beacon.zone_id._id.toString(),
            room: {
              floor: beacon.zone_id.room?.floor ?? 0,
              room_number: beacon.zone_id.room?.room_number ?? "",
              building: {
                code: beacon.zone_id.room?.building?.code ?? "",
                name: beacon.zone_id.room?.building?.name ?? "",
              },
            },
          }
        : null,
    };

    return { success: true, beacon: safeBeacon };
  } catch (error) {
    console.error("Get beacon by ID error:", error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Beacon");
    // return { success: false, message: "Server error", beacon: null };
  }
}

export async function updateBeaconById(id: string, data: any) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID ไม่ถูกต้อง");
      // return { success: false, message: "ID ไม่ถูกต้อง" };
    }

    const updated = await Beacons.findByIdAndUpdate(id, { $set: data });

    if (!updated) {
      throw new Error("ไม่พบอุปกรณ์บลูทูธดังกล่าว");
      // return {
      //   success: false,
      //   message: "ไม่พบอุปกรณ์บลูทูธดังกล่าว",
      // };
    }

    revalidatePath("/beacons");
    return {
      success: true,
      message: "อัปเดตอุปกรณ์บลูทูธสำเร็จ",
    };
  } catch (error: any) {
    console.error("Update beacon error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดระหว่างการอัปเดตข้อมูล");
    // return {
    //   success: false,
    //   message: "เกิดข้อผิดพลาดระหว่างการอัปเดตข้อมูล",
    // };
  }
}

export async function getAllBeaconForZone() {
  try {
    await connectDB();
    const beacons = await Beacons.find().select("label mac_address").lean();
    const safeBeacon: zoneBeacons[] = beacons.map((b: any) => ({
      _id: b._id.toString(),
      label: b.label,
      mac_address: b.mac_address,
    }));

    return {
      success: true,
      beacons: safeBeacon,
    };
  } catch (error) {
    console.log(error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Beacon สำหรับ Zone");
    // return { success: false, beacons: [] };
  }
}
