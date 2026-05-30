import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Asset from "@/models/Asset";
import { validatePositiveInteger } from "@/lib/utils";

// Validation helpers
function validateStringField(value: unknown, fieldName: string, minLength: number, maxLength: number, pattern?: RegExp): { valid: boolean; error?: string } {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required and must be a string` };
  }

  const trimmed = value.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be ${minLength}-${maxLength} characters long` };
  }

  if (pattern && !pattern.test(trimmed)) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }

  return { valid: true };
}

function validateRFIDUIDField(value: unknown): { valid: boolean; error?: string } {
  if (!value) return { valid: true }; // Optional
  if (typeof value !== 'string') return { valid: false, error: "RFID UID must be a string" };

  const trimmed = value.trim();
  if (trimmed.length < 8 || trimmed.length > 20) {
    return { valid: false, error: "RFID UID must be 8-20 characters long" };
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(trimmed)) {
    return { valid: false, error: "RFID UID must contain only alphanumeric characters, hyphens, and underscores" };
  }

  return { valid: true };
}

function validateDateFields(dateRegistered: unknown, dateRemoved: unknown): { valid: boolean; error?: string } {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegistered || typeof dateRegistered !== 'string' || !dateRegex.test(dateRegistered)) {
    return { valid: false, error: "Date Registered must be in YYYY-MM-DD format" };
  }

  if (dateRemoved && typeof dateRemoved === 'string') {
    if (!dateRegex.test(dateRemoved)) {
      return { valid: false, error: "Date Removed must be in YYYY-MM-DD format" };
    }

    const regDate = new Date(dateRegistered);
    const remDate = new Date(dateRemoved);
    if (remDate < regDate) {
      return { valid: false, error: "Date Removed must be on or after Date Registered" };
    }
  }

  return { valid: true };
}

function validateEnumField(value: unknown, fieldName: string, validValues: string[]): { valid: boolean; error?: string } {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (!validValues.includes(value.toLowerCase())) {
    return { valid: false, error: `Invalid ${fieldName} value` };
  }

  return { valid: true };
}

function runAllValidations(body: Record<string, unknown>): { valid: boolean; error?: string } {
  const { name, category, location, dateRegistered, dateRemoved, rfidUid, assetType, quantity, assetStatus, condition, description } = body;

  const nameVal = validateStringField(name, "Asset name", 3, 100);
  if (!nameVal.valid) return { valid: false, error: nameVal.error };

  const catVal = validateStringField(category, "Category", 2, 50);
  if (!catVal.valid) return { valid: false, error: catVal.error };

  const locVal = validateStringField(location, "Location", 2, 50, /^[A-Za-z0-9\-\s]+$/);
  if (!locVal.valid) return { valid: false, error: locVal.error };

  const typeVal = validateStringField(assetType, "Asset type", 1, 100);
  if (!typeVal.valid) return { valid: false, error: typeVal.error };

  if (quantity !== undefined && quantity !== null && !validatePositiveInteger(quantity)) {
    return { valid: false, error: "Quantity must be a positive whole number" };
  }

  const dateVal = validateDateFields(dateRegistered, dateRemoved);
  if (!dateVal.valid) return { valid: false, error: dateVal.error };

  const rfidVal = validateRFIDUIDField(rfidUid);
  if (!rfidVal.valid) return { valid: false, error: rfidVal.error };

  const condVal = validateEnumField(condition, "Condition", ['new', 'good', 'fair', 'poor']);
  if (!condVal.valid) return { valid: false, error: condVal.error };

  const statVal = validateEnumField(assetStatus, "Asset status", ['active', 'inactive', 'maintenance', 'retired']);
  if (!statVal.valid) return { valid: false, error: statVal.error };

  if (description && typeof description === 'string' && description.trim().length > 500) {
    return { valid: false, error: "Description must not exceed 500 characters" };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = runAllValidations(body);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const { name, category, location, dateRegistered, dateRemoved, rfidUid, assetType, quantity, assetStatus, condition, description } = body;

    const newAsset = new Asset({
      name: (name as string).trim(),
      category: (category as string).trim(),
      location: (location as string).trim(),
      dateRegistered,
      dateRemoved: dateRemoved || null,
      rfidUid: rfidUid ? (rfidUid as string).trim() : null,
      assetType: (assetType as string).trim(),
      quantity: quantity ? Number.parseInt(String(quantity)) : 1,
      assetStatus,
      condition,
      description: description ? (description as string).trim() : "",
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