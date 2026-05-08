import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import RFIDTag from "@/models/RFIDTag";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const rfidTags = await RFIDTag.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ rfidTags }, { status: 200 });
  } catch (error) {
    console.error("Error fetching RFID tags:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}