import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ user: null });

    const user = await User.findById(decoded.id).lean();
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role || "user",
      },
    });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
