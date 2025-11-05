import crypto from "crypto";
import "dotenv/config"; // ✅ โหลดค่า .env ให้อัตโนมัติ

function generateClientSignature(
  device_id: string,
  student_id: string,
  course_id: string,
  timestamp: number,
  key: string
): string {
  const message = `${device_id}#${student_id}#${course_id}#${timestamp}`;
  const signClient = crypto
    .createHmac("sha256", key)
    .update(message)
    .digest("hex"); // ✅ ใช้ hex เพื่อให้ตรงกับ server
  return signClient;
}

// 🔹 ตัวอย่างทดสอบ
const device_id = "68ff446f54a5880eb80b917e123s";
const student_id = "12345678";
const course_id = "69019d6d4a4c399ae5f71ad5";
const timestamp = Date.now();
console.log(timestamp);

const key = "28932d13962cf3a3e9dcf3fdfe091e8ae7358c8c4d706e8ad7d5191280ebc468"

if (!key || key.trim() === "") {
  console.error("❌ Missing SECRET_SIGNATURE in .env file");
  process.exit(1);
}

console.log("🧾 Message:", `${device_id}#${student_id}#${course_id}#${timestamp}`);
console.log("🔐 Client Sign:", generateClientSignature(device_id, student_id, course_id, timestamp, key));
