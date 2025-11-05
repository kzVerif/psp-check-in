// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/mongodb";
// import { Devices } from "@/models/mongoModel"; // ✅ ใช้ชื่อเดียวกับ model ใน schema

// // optional: ถ้าพี่ใช้ TypeScript แนะนำเพิ่ม interface
// interface IDevice {
//   _id?: string;
//   student_id: string;
//   device_id: string;
//   name: string;
//   password: string;
//   createdAt?: Date;
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();
//     const { student_id, device_id, name, password } = body;

//     // ✅ ตรวจสอบว่า field ครบไหม
//     if (!student_id || !device_id || !name || !password) {
//       return NextResponse.json(
//         { success: false, message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" }
//       );
//     }

//     // ✅ ตรวจว่ามีอยู่แล้วหรือยัง (ใช้ Devices)
//     const existing = await Devices.findOne({
//       $or: [{ student_id }, { device_id }],
//     }).lean<IDevice>();

//     if (existing) {
//       return NextResponse.json(
//         { success: false, message: "มีผู้ใช้นี้ในระบบแล้ว" }
//       );
//     }

//     // ✅ เข้ารหัสรหัสผ่าน
//     const hashPassword = await bcrypt.hash(password, 10);

//     // ✅ บันทึกข้อมูล
//     const newDevice = await Devices.create({
//       student_id,
//       device_id,
//       name,
//       password: hashPassword,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "สมัครสมาชิกสำเร็จ",
//         data: {
//           id: newDevice._id,
//           student_id: newDevice.student_id,
//           device_id: newDevice.device_id,
//           name: newDevice.name,
//           createdAt: newDevice.created_at || newDevice.registered_at,
//         },
//       }
//     );
//   } catch (error: any) {
//     console.error("เกิดข้อผิดพลาด:", error);

//     // ✅ ตรวจจับ Duplicate Key Error จาก MongoDB
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: "มีผู้ใช้นี้ในระบบแล้ว" }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "เกิดข้อผิดพลาดจาก Server" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Devices } from "@/models/mongoModel";

interface IDevice {
  _id?: string;
  student_id: string;
  device_id: string;
  name: string;
  password: string;
  createdAt?: Date;
}

// ✅ ตอบ CORS Preflight (สำคัญมาก)
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
    await connectDB();

    const body = await req.json();
    const { student_id, device_id, name, password } = body;

    // ✅ ตรวจสอบว่า field ครบไหม
    if (!student_id || !device_id || !name || !password) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" },
        {
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // ✅ ตรวจว่ามีอยู่แล้วหรือยัง
    const existing = await Devices.findOne({
      $or: [{ student_id }, { device_id }],
    }).lean<IDevice>();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "มีผู้ใช้นี้ในระบบแล้ว" },
        {
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // ✅ เข้ารหัสรหัสผ่าน
    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ บันทึกข้อมูล
    const newDevice = await Devices.create({
      student_id,
      device_id,
      name,
      password: hashPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "สมัครสมาชิกสำเร็จ",
        data: {
          id: newDevice._id,
          student_id: newDevice.student_id,
          device_id: newDevice.device_id,
          name: newDevice.name,
          createdAt: newDevice.created_at || newDevice.registered_at,
        },
      },
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาด:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "มีผู้ใช้นี้ในระบบแล้ว" },
        {
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดจาก Server" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

