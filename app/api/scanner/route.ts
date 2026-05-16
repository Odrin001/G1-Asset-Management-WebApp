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

    // Validate UID
    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { message: "UID is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedUid = uid.trim();
    if (trimmedUid.length < 8 || trimmedUid.length > 20) {
      return NextResponse.json(
        { message: "Invalid UID format" },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z0-9\-_]+$/.test(trimmedUid)) {
      return NextResponse.json(
        { message: "UID contains invalid characters" },
        { status: 400 }
      );
    }

    // Validate room
    if (!room || typeof room !== 'string') {
      return NextResponse.json(
        { message: "Room is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedRoom = room.trim();
    if (trimmedRoom.length < 2 || trimmedRoom.length > 50) {
      return NextResponse.json(
        { message: "Room name must be 2-50 characters long" },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z0-9\-\s]+$/.test(trimmedRoom)) {
      return NextResponse.json(
        { message: "Room name contains invalid characters" },
        { status: 400 }
      );
    }

    // Find RFID tag
    const tag = await RFIDTag.findOne({ uid: trimmedUid });

    if (!tag) {
      console.log("RFID tag not registered", trimmedUid);
      return NextResponse.json(
        { message: "RFID tag not registered" },
        { status: 404 }
      );
    }

    let action = "";
    let fromRoom = "";
    let toRoom = "";

    // Determine ENTER or EXIT
    if (tag.currentRoom === "Outside" || !tag.currentRoom) {
      action = "ENTER";
      fromRoom = "-";
      toRoom = trimmedRoom;

      tag.currentRoom = trimmedRoom;
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
      uid: trimmedUid,
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

    console.log("Scan log created", { uid: trimmedUid, action, fromRoom, toRoom, assetName: tag.assetName });

    return NextResponse.json(
      {
        message: "Scan recorded",
        action,
        asset: tag.assetName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Scanner error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}