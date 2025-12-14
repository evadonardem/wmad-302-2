import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json([], { status: 200 }); // RETURN ARRAY
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json([], { status: 200 }); // RETURN ARRAY
    }

    if (decoded.role !== "admin") {
      return NextResponse.json([], { status: 200 }); // RETURN ARRAY
    }

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      orders.map((o) => ({
        id: o._id.toString(),
        status: o.status,
        totalPrice: o.totalPrice,
        createdAt: o.createdAt,
        items: o.items,
      })),
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN ORDER ROUTE ERROR:", err);
    return NextResponse.json([], { status: 200 }); // ALWAYS RETURN ARRAY
  }
}
