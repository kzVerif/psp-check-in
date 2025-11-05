"use server";
import { connectDB } from "@/lib/mongodb";
import { Devices } from "@/models/mongoModel";
import { DeviceBody } from "@/var_type/type";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export interface IDevice {
  _id: string; // 👈 แปลงแล้วเป็น string
  device_id: string;
  student_id: string;
  name: string;
  password: string;
  registered_at: string | null; // ถ้าเป็น Date → string
  __v?: number;
}

export async function addDevice(data: DeviceBody) {
  await connectDB();

  const { student_id, device_id, name, password } = data;

  if (!student_id || !device_id || !name || !password) {
    throw new Error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    // return { success: false, message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" };
  }

  const existing = await Devices.findOne({
    $or: [{ student_id }, { device_id }],
  });
  if (existing) {
    throw new Error("มีผู้ใช้นี้ในระบบแล้ว");
    // return { success: false, message: "มีผู้ใช้นี้ในระบบแล้ว" };
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await Devices.create({ student_id, device_id, name, password: hashPassword });

  revalidatePath("/devices");
  return { success: true, message: "สมัครสมาชิกสำเร็จ" };
}

export async function getAllDevices() {
  try {
    await connectDB();
    const devices = await Devices.find().lean();

    const safeDevices: IDevice[] = devices.map((d: any) => ({
      _id: d._id.toString(),
      device_id: d.device_id,
      student_id: d.student_id,
      name: d.name,
      password: d.password,
      registered_at: d.registered_at?.toISOString?.() ?? null,
      __v: d.__v,
    }));

    return {
      success: true,
      devices: safeDevices,
    };
  } catch (error) {
    console.error("Get all devices error:", error);
    throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูลอุปกรณ์");
    // return { success: false, devices: [] };
  }
}

export async function deleteDevices(studentId: string) {
  try {
    await connectDB();

    const del = await Devices.findOneAndDelete({ student_id: studentId });

    if (!del) {
      throw new Error("ไม่พบอุปกรณ์นี้ในระบบ");
      // return {
      //   success: false,
      //   message: "ไม่พบอุปกรณ์นี้ในระบบ",
      // };
    }
    revalidatePath("/devices");
    return {
      success: true,
      message: "ลบอุปกรณ์เรียบร้อยแล้ว!",
    };
  } catch (error: any) {
    console.error("Delete device error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการลบอุปกรณ์");
    // return {
    //   success: false,
    //   message: "เกิดข้อผิดพลาดในการลบ",
    // };
  }
}

export async function getDeviceByStudentId(studentId: string) {
  try {
    await connectDB();
    const device = await Devices.findOne({ student_id: studentId });

    if (!device) {
      throw new Error("ไม่พบอุปกรณ์นี้ในระบบ");
      // return {
      //   success: false,
      //   message: "ไม่พบอุปกรณ์นี้ในระบบ",
      // };
    }

    const safeDevice: IDevice = {
      _id: device._id.toString(),
      device_id: device.device_id,
      student_id: device.student_id,
      name: device.name,
      password: device.password,
      registered_at: device.registered_at?.toISOString?.() ?? null,
      __v: device.__v,
    };

    return {
      success: true,
      device: safeDevice,
    };
  } catch (error: any) {
    console.error("Get device by student ID error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลอุปกรณ์");
    // return {
    //   success: false,
    //   message: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
    // };
  }
}

export async function updateDeviceByStudentId(studentId: string, data: any) {
  try {
    await connectDB();

    const updated = await Devices.findOneAndUpdate(
      { student_id: studentId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error("ไม่พบอุปกรณ์นี้ในระบบ");
      // return { success: false, message: "ไม่พบอุปกรณ์นี้ในระบบ" };
    }

    const plainDevice = updated.toObject();
    plainDevice._id = plainDevice._id.toString();
    plainDevice.registered_at =
      plainDevice.registered_at?.toISOString?.() ?? null;

    return { success: true, device: plainDevice, message: "อัพเดทสำเร็จ" };
  } catch (error: any) {
    console.error("Update device error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูลอุปกรณ์");
    // return { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" };
  }
}
