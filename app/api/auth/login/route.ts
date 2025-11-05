// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/mongodb";
// import { Devices } from "@/models/mongoModel";

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
//     const { student_id, device_id, password } = body;

//     // ✅ กำหนด type ให้กับ lean()
//     const user = await Devices.findOne({ student_id }).lean<IDevice>();

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "ไม่พบผู้ใช้นี้ในระบบ" }
//       );
//     }

//     // ✅ ตรวจสอบ device
//     if (device_id !== user.device_id && user.device_id !== "000") {
//       return NextResponse.json(
//         { success: false, message: "กรุณาเข้าสู่ระบบด้วยอุปกรณ์ที่ถูกต้อง" }
//       );
//     }

//     // ✅ ตรวจสอบรหัสผ่าน
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { success: false, message: "รหัสผ่านผิด กรุณาลองอีกครั้ง" }
//       );
//     }

//     // ✅ เข้าสู่ระบบสำเร็จ
//     return NextResponse.json({
//       success: true,
//       message: "เข้าสู่ระบบสำเร็จ",
//       user,
//     });
//   } catch (error) {
//     console.error("เกิดข้อผิดพลาด:", error);
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

// ✅ ตอบ Preflight Request
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
    const { student_id, device_id, password } = body;

    if (!student_id || !device_id || !password) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบ" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ หา user ในระบบ
    const user = await Devices.findOne({ student_id }).lean<IDevice>();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "ไม่พบผู้ใช้นี้ในระบบ" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ ตรวจสอบอุปกรณ์
    if (device_id !== user.device_id && user.device_id !== "000") {
      return NextResponse.json(
        { success: false, message: "กรุณาเข้าสู่ระบบด้วยอุปกรณ์ที่ถูกต้อง" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "รหัสผ่านผิด กรุณาลองอีกครั้ง" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ เข้าสู่ระบบสำเร็จ
    return NextResponse.json(
      {
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        user,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดจาก Server" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
