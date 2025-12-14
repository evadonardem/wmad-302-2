// app/api/orders/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

// ==============================
// CREATE ORDER (POST)
// ==============================
export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    console.log("TOKEN RECEIVED:", token);

    if (!token) {
      return NextResponse.json({ error: "No token sent" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { items, totalPrice } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const formattedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      quantity: Number(item.quantity),
      thumbnail: item.thumbnail,
    }));

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(decoded.id), // REQUIRED
      items: formattedItems,
      totalPrice: Number(totalPrice),
      status: "pending",
    });

    return NextResponse.json(
      { orderId: order._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/orders ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// ==============================
// GET USER ORDERS (GET)
// ==============================
export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token sent" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      orders.map((o) => ({
        id: o._id.toString(),
        createdAt: o.createdAt?.toISOString() ?? null,
        status: o.status,
        totalPrice: Number(o.totalPrice),
        items: o.items,
      })),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/orders ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}
