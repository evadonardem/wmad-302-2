import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    thumbnail: String,
  },
  { _id: false }
);

// ⭐ SHIPPING STRUCTURE — CORRECT
const ShippingSchema = new mongoose.Schema(
  {
    fullName: String,
    mobile: String,
    address: String,
    notes: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    // ✅ userId is correct
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ items array OK
    items: [OrderItemSchema],

    // ✅ totalPrice OK
    totalPrice: Number,

    // ⭐ SHIPPING FIELD PRESENT & CORRECT
    shipping: ShippingSchema,

    // ⭐ PAYMENT METHOD ENUM — CORRECT
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      default: "online",
    },

    // 📌 STATUS ENUM — CORRECT
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },

    // 📌 createdAt still exists — OK (timestamps also handles createdAt & updatedAt)
    createdAt: { type: Date, default: Date.now },
  },
  // 📌 timestamps true is correct — won't break anything
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
