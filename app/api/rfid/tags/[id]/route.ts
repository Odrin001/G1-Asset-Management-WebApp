import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RFIDTag from "@/models/RFIDTag";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deletedTag = await RFIDTag.findByIdAndDelete(
      params.id
    );

    if (!deletedTag) {
      return NextResponse.json(
        { message: "RFID tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "RFID tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting RFID tag:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}