import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import RFIDTag from "@/models/RFIDTag";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { uid, assetName, currentRoom, category, quantity, assetStatus, condition, description } = body;

    if (!uid || !assetName) {
      return NextResponse.json(
        { message: "UID and asset name are required" },
        { status: 400 }
      );
    }

    const existingTag = await RFIDTag.findOne({ uid });

    if (existingTag) {
      return NextResponse.json(
        { message: "RFID already registered" },
        { status: 409 }
      );
    }

    const newTag = await RFIDTag.create({
      uid,
      assetName,
      currentRoom: currentRoom || "Outside",
      category: category || "Furniture",
      quantity: quantity || 1,
      assetStatus: assetStatus || "active",
      condition: condition || "good",
      description: description || "",
      dateRegistered: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json(
      {
        message: "RFID registered successfully",
        tag: newTag,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering RFID:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { message: `Failed to register RFID: ${errorMessage}` },
      { status: 500 }
    );
  }
}