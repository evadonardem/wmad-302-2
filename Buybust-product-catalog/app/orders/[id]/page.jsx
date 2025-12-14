import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function OrderDetails({ params }) {
  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id).lean();

  if (!order) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          color: "#4B2E19",
        }}
      >
        <h2>Order not found.</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
        color: "#4B2E19",
      }}
    >
      {/* HEADER CARD */}
      <div
        style={{
          background: "#F7ECE2",
          borderRadius: "12px",
          border: "1px solid #D4B8A6",
          padding: "24px",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "28px",
            color: "#4B2E19",
          }}
        >
          Order #{order._id.toString()}
        </h1>

        <p style={{ marginTop: "12px", fontSize: "15px" }}>
          <b>Created:</b> {new Date(order.createdAt).toLocaleString()}
        </p>

        <p style={{ fontSize: "16px" }}>
          <b>Status:</b>{" "}
          <span
            style={{
              padding: "4px 10px",
              background: "#EBD3B0",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            {order.status}
          </span>
        </p>

        {/* Payment Method */}
        {order.paymentMethod && (
          <p style={{ marginTop: "5px" }}>
            <b>Payment:</b>{" "}
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Online Payment"}
          </p>
        )}

        {/* DELIVERY INFO */}
        {order.shipping && (
          <div style={{ marginTop: "15px" }}>
            <h3 style={{ marginBottom: "8px", color: "#4B2E19" }}>
              Delivery Information
            </h3>
            <p>
              <b>Name:</b> {order.shipping.fullName}
            </p>
            <p>
              <b>Mobile:</b> {order.shipping.mobile}
            </p>
            <p>
              <b>Address:</b> {order.shipping.address}
            </p>
            {order.shipping.notes && (
              <p>
                <b>Notes:</b> {order.shipping.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ITEMS LIST */}
      <h2 style={{ marginBottom: "10px", color: "#4B2E19" }}>Items</h2>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #D4B8A6",
          padding: "20px",
        }}
      >
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "18px",
              paddingBottom: "18px",
              borderBottom: "1px solid #E0C7B4",
            }}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{item.title}</p>
              <p style={{ margin: "4px 0" }}>
                ₱{item.price} × {item.quantity}
              </p>
              <p style={{ fontWeight: 600 }}>
                Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <h2 style={{ marginTop: "30px", fontSize: "26px", fontWeight: 700 }}>
        Total: ₱{order.totalPrice}
      </h2>
    </div>
  );
}
