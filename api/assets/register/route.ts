import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Asset from "@/models/Asset";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      category,
      location,
      dateRegistered,
      dateRemoved,
      rfidUid,
      assetType,
      quantity,
      assetStatus,
      condition,
      description,
    } = body;

    // Validate required fields
    if (!name || !category || !location || !dateRegistered || !assetType || !assetStatus || !condition) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new asset
    const newAsset = new Asset({
      name,
      category,
      location,
      dateRegistered,
      dateRemoved,
      rfidUid,
      assetType,
      quantity: quantity || 1,
      assetStatus,
      condition,
      description,
    });

    await newAsset.save();

    return NextResponse.json(
      { message: "Asset registered successfully", asset: newAsset },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering asset:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { message: `Failed to register asset: ${errorMessage}` },
      { status: 500 }
    );
  }
}