import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { validateSDCAEmail } from "@/lib/utils";

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

    const { email, password } = await req.json();

    // Validate email presence
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: "Email is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!validateSDCAEmail(trimmedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate password presence
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { message: "Password is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (password.length < 6 || password.length > 100) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid Email" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { message: "Invalid Password" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
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