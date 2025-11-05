import mongoose, { Schema, model } from "mongoose"

// ✅ ENUM
export const CheckinStatus = {
  CHECKED_IN: "เข้าเรียน",
  LATE: "สาย",
  ABSENT: "ขาด",
}

// ✅ Subschemas
const CheckinsPositionSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
},{ _id: false })

const ZonesRoomBuildingSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
},{ _id: false })

const ZonesRoomSchema = new Schema({
  building: { type: ZonesRoomBuildingSchema, required: true },
  floor: { type: Number, required: true },
  room_number: { type: String, required: true },
},{ _id: false })

// ✅ Devices Schema
const DevicesSchema = new Schema({
  device_id: { type: String, required: true },
  student_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  registered_at: { type: Date, default: Date.now },
})

// ✅ Beacons Schema
const BeaconsSchema = new Schema({
  label: { type: String, required: true },
  mac_address: { type: String, required: true, unique: true }, // ✅ แก้พิมพ์ผิด
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  zone_id: { type: Schema.Types.ObjectId, ref: "Zones" },
})

const SchedulesTimeSchema = new Schema({
  day_of_week: { type: Number, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true }
},{ _id: false })

// ✅ Schedules Schema
const SchedulesSchema = new Schema(
  {
    course_code: { type: String, required: true },
    course_name: { type: String, required: true },
    semester: { type: String, required: true },
    time: {
      type: [SchedulesTimeSchema], // 👈 array ของ subdocument
      required: true,
      validate: {
        validator: (v: any[]) => Array.isArray(v) && v.length > 0,
        message: "ต้องมีอย่างน้อย 1 เวลาสอน",
      },
    },
    zone_id: { type: Schema.Types.ObjectId, ref: "Zones", default: null },
  },
  { timestamps: true }
);

// Unique combination: (course_code, day_of_week, start_time)
SchedulesSchema.index({ course_code: 1, day_of_week: 1, start_time: 1 }, { unique: true })

// ✅ Checkins Schema
const CheckinsSchema = new Schema({
  position: { type: CheckinsPositionSchema, required: true },
  status: {
    type: String,
    enum: Object.values(CheckinStatus),
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  schedules_id: {type: Schema.Types.ObjectId, ref: "Schedules"},
  zone_id: { type: Schema.Types.ObjectId, ref: "Zones" },
  device_id: { type: Schema.Types.ObjectId, ref: "Devices" },
})

// ✅ Zones Schema
const ZonesSchema = new Schema({
  room: { type: ZonesRoomSchema, required: true },
  beacons: [{ type: Schema.Types.ObjectId, ref: "Beacons" }],
  schedules: [{ type: Schema.Types.ObjectId, ref: "Schedules" }],
  checkins: { type: Schema.Types.ObjectId, ref: "Checkins" },
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// ✅ Create Models
export const Devices = mongoose.models.Devices || model("Devices", DevicesSchema)
export const Beacons = mongoose.models.Beacons || model("Beacons", BeaconsSchema)
export const Schedules = mongoose.models.Schedules || model("Schedules", SchedulesSchema)
export const Checkins = mongoose.models.Checkins || model("Checkins", CheckinsSchema)
export const Zones = mongoose.models.Zones || model("Zones", ZonesSchema)
export const User = mongoose.models.User || mongoose.model("User", userSchema);

