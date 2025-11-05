import { connectDB } from "@/lib/mongodb";
import { Schedules } from "@/models/mongoModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const schedules = await Schedules.find().select(
      "course_code course_name semester"
    );
    return NextResponse.json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      schedules: [],
    });
  }
}
