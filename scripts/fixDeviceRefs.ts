import { connectDB } from "../lib/mongodb";
import { Checkins, Devices } from "@/models/mongoModel";

async function fixDeviceRefs() {
  await connectDB();
  const badCheckins = await Checkins.find({ device_id: { $type: "string" } });

  for (const checkin of badCheckins) {
    // สมมติว่าใน Checkins.device_id เก็บชื่อ device
    const device = await Devices.findOne({ name: checkin.device_id });
    if (device) {
      checkin.device_id = device._id;
      await checkin.save();
      console.log(`✅ Updated ${checkin._id} → ${device._id}`);
    } else {
      console.warn(`⚠️ No matching device for ${checkin.device_id}`);
    }
  }

  console.log("🎯 Migration complete!");
  process.exit(0);
}

fixDeviceRefs();
