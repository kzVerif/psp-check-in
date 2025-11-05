"use server"
import { connectDB } from "@/lib/mongodb";
import { Checkins, Devices, Zones } from "@/models/mongoModel";

export async function getDashBoardData() {
  try {
    await connectDB();
    const [zonesCount, devicesCount, checkinsCount, recentCheckins] =
      await Promise.all([
        Zones.countDocuments(),
        Devices.countDocuments(),
        Checkins.countDocuments(),
        Checkins.find()
          .sort({ timestamp: -1 })
          .limit(5)
          .populate({
            path: "zone_id",
            populate: [
              { path: "beacons" },
              { path: "schedules" },
              { path: "checkins" },
            ],
          })
          .populate("zone_id")
          .populate("device_id")
          .populate("schedules_id")
          .lean(),
      ]);

    return {
      zonesCount,
      devicesCount,
      checkinsCount,
      recentCheckins,
    };
  } catch (error: any) {
    console.error("Error in getDashBoardData:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    // return {
    //   zonesCount: 0,
    //   devicesCount: 0,
    //   checkinsCount: 0,
    //   recentCheckins: [],
    // };
  }
}
