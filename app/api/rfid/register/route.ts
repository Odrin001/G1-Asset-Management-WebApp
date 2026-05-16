import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validatePositiveInteger } from "@/lib/utils";

import RFIDTag from "@/models/RFIDTag";

// Validation helper functions
function validateUIDField(uid: unknown): { valid: boolean; error?: string } {
  if (!uid || typeof uid !== 'string') {
    return { valid: false, error: "UID is required and must be a string" };
  }

  const trimmedUid = uid.trim();
  if (trimmedUid.length < 8 || trimmedUid.length > 20) {
    return { valid: false, error: "UID must be 8-20 characters long" };
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(trimmedUid)) {
    return { valid: false, error: "UID must contain only alphanumeric characters, hyphens, and underscores" };
  }

  return { valid: true };
}

function validateAssetNameField(assetName: unknown): { valid: boolean; error?: string } {
  if (!assetName || typeof assetName !== 'string') {
    return { valid: false, error: "Asset name is required and must be a string" };
  }

  const trimmedAssetName = assetName.trim();
  if (trimmedAssetName.length < 3 || trimmedAssetName.length > 100) {
    return { valid: false, error: "Asset name must be 3-100 characters long" };
  }

  return { valid: true };
}

function validateOptionalStringField(value: unknown, fieldName: string, minLength: number, maxLength: number, pattern?: RegExp): { valid: boolean; error?: string } {
  if (!value) return { valid: true };
  if (typeof value !== 'string') return { valid: false, error: `${fieldName} must be a string` };

  const trimmed = value.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be ${minLength}-${maxLength} characters long` };
  }

  if (pattern && !pattern.test(trimmed)) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }

  return { valid: true };
}

function validateEnumField(value: unknown, fieldName: string, validValues: string[]): { valid: boolean; error?: string } {
  if (!value || typeof value !== 'string') return { valid: true }; // Optional
  if (!validValues.includes(value.toLowerCase())) {
    return { valid: false, error: `Invalid ${fieldName} value` };
  }
  return { valid: true };
}

function validateDateFields(dateRegistered: unknown, dateRemoved: unknown): { valid: boolean; error?: string } {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateRegistered && typeof dateRegistered === 'string') {
    if (!dateRegex.test(dateRegistered)) {
      return { valid: false, error: "Date Registered must be in YYYY-MM-DD format" };
    }
  }

  if (dateRemoved && typeof dateRemoved === 'string') {
    if (!dateRegex.test(dateRemoved)) {
      return { valid: false, error: "Date Removed must be in YYYY-MM-DD format" };
    }

    if (typeof dateRegistered === 'string') {
      const regDate = new Date(dateRegistered);
      const remDate = new Date(dateRemoved);
      if (remDate < regDate) {
        return { valid: false, error: "Date Removed must be on or after Date Registered" };
      }
    }
  }

  return { valid: true };
}

function runAllValidations(body: Record<string, unknown>): { valid: boolean; error?: string } {
  const { uid, assetName, currentRoom, category, quantity, assetStatus, condition, description, dateRegistered, dateRemoved } = body;

  const uidVal = validateUIDField(uid);
  if (!uidVal.valid) return { valid: false, error: uidVal.error };

  const nameVal = validateAssetNameField(assetName);
  if (!nameVal.valid) return { valid: false, error: nameVal.error };

  if (quantity !== undefined && quantity !== null && !validatePositiveInteger(quantity)) {
    return { valid: false, error: "Quantity must be a positive whole number" };
  }

  const roomVal = validateOptionalStringField(currentRoom, "Room name", 2, 50, /^[A-Za-z0-9\-\s]+$/);
  if (!roomVal.valid) return { valid: false, error: roomVal.error };

  const catVal = validateOptionalStringField(category, "Category", 1, 50);
  if (!catVal.valid) return { valid: false, error: catVal.error };

  const descVal = validateOptionalStringField(description, "Description", 1, 500);
  if (!descVal.valid) return { valid: false, error: descVal.error };

  const condVal = validateEnumField(condition, "condition", ['new', 'good', 'fair', 'poor']);
  if (!condVal.valid) return { valid: false, error: condVal.error };

  const statVal = validateEnumField(assetStatus, "status", ['active', 'inactive', 'maintenance', 'retired']);
  if (!statVal.valid) return { valid: false, error: statVal.error };

  const dateVal = validateDateFields(dateRegistered, dateRemoved);
  if (!dateVal.valid) return { valid: false, error: dateVal.error };

  return { valid: true };
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const validation = runAllValidations(body);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const { uid, assetName, currentRoom, category, quantity, assetStatus, condition, description, dateRegistered, dateRemoved } = body;
    const trimmedUid = (uid as string).trim();

    const existingTag = await RFIDTag.findOne({ uid: trimmedUid });
    if (existingTag) {
      return NextResponse.json({ message: "RFID already registered" }, { status: 409 });
    }

    const newTag = await RFIDTag.create({
      uid: trimmedUid,
      assetName: (assetName as string).trim(),
      currentRoom: currentRoom ? (currentRoom as string).trim() : "Outside",
      category: category ? (category as string).trim() : "Furniture",
      quantity: quantity ? Number.parseInt(String(quantity)) : 1,
      assetStatus: assetStatus || "active",
      condition: condition || "good",
      description: description ? (description as string).trim() : "",
      dateRegistered: dateRegistered || new Date().toISOString().split('T')[0],
      dateRemoved: dateRemoved || null,
    });

    return NextResponse.json(
      { message: "RFID registered successfully", tag: newTag },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering RFID:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message: `Failed to register RFID: ${errorMessage}` }, { status: 500 });
  }
}