import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import ScanLog from "@/models/ScanLog";

export async function GET() {
  try {
    await connectDB();

    const logs = await ScanLog.find()
      .sort({ createdAt: -1 })
      .limit(50);

    console.log("Fetched logs", logs.length);

    return NextResponse.json(logs, {
      status: 200,
    });
  } catch (error) {
    console.log("Error fetching logs", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}