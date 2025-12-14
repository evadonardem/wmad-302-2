// app/api/profile/update/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import fs from "fs";
import path from "path";

const PUBLIC_UPLOADS = path.join(process.cwd(), "public", "uploads");

async function saveAvatarBase64(userId, base64) {
  if (!base64) return null;
  if (!fs.existsSync(PUBLIC_UPLOADS)) fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });

  const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
  const ext = matches ? matches[1].split("/")[1] : "png";
  const data = matches ? matches[2] : base64;
  const buffer = Buffer.from(data, "base64");
  const filename = `${userId}-avatar-${Date.now()}.${ext}`;
  const filepath = path.join(PUBLIC_UPLOADS, filename);
  await fs.promises.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function POST(req) {
  try {
    await connectDB();

    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { name, email, avatarBase64 } = body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (avatarBase64) {
      try {
        const avatarPath = await saveAvatarBase64(decoded.id, avatarBase64);
        if (avatarPath) updates.avatar = avatarPath;
      } catch (e) {
        console.error("Avatar save failed:", e);
        return NextResponse.json({ error: "Failed to save avatar" }, { status: 500 });
      }
    }

    const updated = await User.findByIdAndUpdate(decoded.id, updates, { new: true, runValidators: true }).lean();
    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role || "user",
        avatar: updated.avatar || null,
      }
    }, { status: 200 });

  } catch (err) {
    console.error("POST /api/profile/update ERROR:", err);
    if (err && err.code === 11000) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
