import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { validateFullName, validateSDCAEmail } from "@/lib/utils";

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: String,
});

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { fullName, email, password } = await req.json();

    // Validate all fields are present
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate full name
    if (typeof fullName !== 'string') {
      return NextResponse.json(
        { message: "Full name must be a string" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const trimmedFullName = fullName.trim();
    if (trimmedFullName.length < 2 || trimmedFullName.length > 100) {
      return NextResponse.json(
        { message: "Full name must be 2-100 characters long" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (!validateFullName(trimmedFullName)) {
      return NextResponse.json(
        { message: "Full name contains invalid characters" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate email
    if (typeof email !== 'string') {
      return NextResponse.json(
        { message: "Email must be a string" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!validateSDCAEmail(trimmedEmail)) {
      return NextResponse.json(
        { message: "Use a valid SDCA email address" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate password
    if (typeof password !== "string") {
      return NextResponse.json(
        { message: "Password must be a string" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (password.length > 100) {
      return NextResponse.json(
        { message: "Password is too long" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: trimmedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        {
          status: 409,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName: trimmedFullName,
      email: trimmedEmail,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
      },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}