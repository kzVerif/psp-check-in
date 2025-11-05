import { connectDB } from "@/lib/mongodb";
import { User } from "../../../models/mongoModel"
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    await connectDB();

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return Response.json({ success: false, message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });

    return Response.json({ success: true, message: "สมัครสมาชิกสำเร็จ" });
  } catch (err) {
    return Response.json({ success: false, message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
