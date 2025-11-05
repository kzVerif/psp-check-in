import mongoose from "mongoose";
import { Devices, Beacons, Schedules, Zones, Checkins, CheckinStatus } from "../models/mongoModel"
import { connectDB } from "@/lib/mongodb";

async function main() {
  await connectDB();

  console.log("🧹 ล้างข้อมูลเก่าทั้งหมด...");
  await Promise.all([
    Devices.deleteMany({}),
    Beacons.deleteMany({}),
    Schedules.deleteMany({}),
    Zones.deleteMany({}),
    Checkins.deleteMany({}),
  ]);

  console.log("📦 เริ่ม Seed ข้อมูล...");

  // ✅ 1. สร้าง Devices
  const device1 = await Devices.create({
    device_id: "DEV001",
    student_id: "650001",
    name: "Kanghun Saegaroon",
    password: "hashed_password_123",
  });

  const device2 = await Devices.create({
    device_id: "DEV002",
    student_id: "650002",
    name: "Pisetpong Sangsom",
    password: "hashed_password_456",
  });

  // ✅ 2. สร้าง Beacons (แต่ละอันอ้างอิง Zone ทีหลัง)
  const beacon1 = await Beacons.create({
    label: "Beacon A",
    mac_address: "AA:BB:CC:DD:EE:01",
    x: 10,
    y: 20,
  });

  const beacon2 = await Beacons.create({
    label: "Beacon B",
    mac_address: "AA:BB:CC:DD:EE:02",
    x: 25,
    y: 35,
  });

  // ✅ 3. สร้าง Schedules (แต่ละอันอ้างอิง Zone ทีหลัง)
  const schedule1 = await Schedules.create({
    course_code: "CS101",
    course_name: "Introduction to Computer Science",
    day_of_week: 1,
    semester: "1/2025",
    start_time: "09:00",
    end_time: "10:30",
  });

  const schedule2 = await Schedules.create({
    course_code: "CS202",
    course_name: "Data Structures",
    day_of_week: 3,
    semester: "1/2025",
    start_time: "13:00",
    end_time: "15:00",
  });

  // ✅ 4. สร้าง Zone
  const zone1 = await Zones.create({
    polygon: [
      { x: 0, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 10 },
      { x: 10, y: 0 },
    ],
    room: {
      building: { code: "SCI", name: "Science Building" },
      floor: 2,
      room_number: "SC201",
    },
    beacons: [beacon1._id, beacon2._id],
    schedules: [schedule1._id],
    Checkins: [],
  });

  // อัพเดต beacon กับ schedule ให้ชี้กลับมาที่ zone นี้
  await Beacons.updateMany({ _id: { $in: [beacon1._id, beacon2._id] } }, { zone_id: zone1._id });
  await Schedules.updateOne({ _id: schedule1._id }, { zone_id: zone1._id });

  // ✅ 5. สร้าง Checkins
  const checkin1 = await Checkins.create({
    position: { x: 5, y: 5 },
    status: CheckinStatus.CHECKED_IN,
    timestamp: new Date(),
    schedules_id: schedule1._id,
    zone_id: zone1._id,
    device_id: device1.device_id,
  });

  const checkin2 = await Checkins.create({
    position: { x: 7, y: 8 },
    status: CheckinStatus.LATE,
    timestamp: new Date(),
    schedules_id: schedule1._id,
    zone_id: zone1._id,
    device_id: device2.device_id,
  });

  // อัพเดต Zone ให้มี Checkins
  zone1.Checkins.push(checkin1._id, checkin2._id);
  await zone1.save();

  console.log("✅ Seed ข้อมูลสำเร็จแล้ว!");
  console.log({
    devices: [device1, device2],
    beacons: [beacon1, beacon2],
    schedules: [schedule1, schedule2],
    zones: [zone1],
    checkins: [checkin1, checkin2],
  });

  await mongoose.connection.close();
  console.log("🔒 ปิดการเชื่อมต่อ MongoDB เรียบร้อย");
}

main().catch((err) => {
  console.error("❌ เกิดข้อผิดพลาดระหว่าง seeding:", err);
  mongoose.connection.close();
});
