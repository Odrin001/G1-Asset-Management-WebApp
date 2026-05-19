import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RFIDTag from "@/models/RFIDTag";

export async function GET() {
  try {
    await connectDB();

    const rfidTags = await RFIDTag.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      rfidTags,
    });
  } catch (error) {
    console.error("Error fetching RFID tags:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}