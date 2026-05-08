import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import RFIDTag from "@/models/RFIDTag";
import ScanLog from "@/models/ScanLog";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { uid, room } = body;

    console.log("Scan request received", { uid, room });

    if (!uid || !room) {
      return NextResponse.json(
        { message: "UID and room are required" },
        { status: 400 }
      );
    }

    // Find RFID tag
    const tag = await RFIDTag.findOne({ uid });

    if (!tag) {
      console.log("RFID tag not registered", uid);
      return NextResponse.json(
        { message: "RFID tag not registered" },
        { status: 404 }
      );
    }

    let action = "";
    let fromRoom = "";
    let toRoom = "";

    // Determine ENTER or EXIT
    if (tag.currentRoom === "Outside") {
      action = "ENTER";
      fromRoom = "-";
      toRoom = room;

      tag.currentRoom = room;
    } else {
      action = "EXIT";
      fromRoom = tag.currentRoom;
      toRoom = "-";

      tag.currentRoom = "Outside";
    }

    // Save updated room
    await tag.save();

                // Create scan log
            const now = new Date();

            await ScanLog.create({
            uid,
            assetName: tag.assetName,
            action,
            fromRoom,
            toRoom,

            time: now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),

            date: now.toLocaleDateString("en-GB"),
            });

    console.log("Scan log created", { uid, action, fromRoom, toRoom, assetName: tag.assetName });

    return NextResponse.json(
      {
        message: "Scan recorded",
        action,
        asset: tag.assetName,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}