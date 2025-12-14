import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await connectDB();

    const form = await request.formData();
    const id = form.get("id");
    const status = form.get("status");

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing ID or status" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ⭐ FIX: Build absolute URL for redirect
    const origin = new URL(request.url).origin;
    const finalUrl = `${origin}/admin/orders/${id}`;

    return NextResponse.redirect(finalUrl);
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Server error while updating order" },
      { status: 500 }
    );
  }
}
