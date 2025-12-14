// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }

    // ⭐ FIXED: Token now includes role
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email,
        role: user.role || "user"  // IMPORTANT
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
