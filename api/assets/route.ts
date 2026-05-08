import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Asset from "@/models/Asset";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const assets = await Asset.find({}).sort({ createdAt: -1 });

    const formattedAssets = assets.map((asset) => ({
      id: asset._id.toString(),
      name: asset.name,
      category: asset.category,
      location: asset.location,
      dateRegistered: asset.dateRegistered,
      dateRemoved: asset.dateRemoved,
      rfidUid: asset.rfidUid,
      assetType: asset.assetType,
      quantity: asset.quantity,
      assetStatus: asset.assetStatus,
      condition: asset.condition,
      description: asset.description,
      createdAt: asset.createdAt,
    }));

    return NextResponse.json({ assets: formattedAssets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}