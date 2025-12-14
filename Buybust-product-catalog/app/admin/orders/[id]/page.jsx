import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";


// ⭐ FIX — unwrap params DO NOT CHANGE!!!
export default async function AdminOrderDetails({ params }) {
  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id).lean();

  if (!order) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
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
      {/* HEADER */}
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
          Admin — Order #{order._id.toString()}
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

        {/* ⭐ ADMIN STATUS EDIT */}
        <form
          action="/api/admin/orders/update"
          method="POST"
          style={{ marginTop: "20px" }}
        >
          <input type="hidden" name="id" value={order._id.toString()} />

          <label style={{ fontWeight: 600 }}>Change Status:</label>
          <select
            name="status"
            defaultValue={order.status}
            style={{
              marginLeft: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #BFA18A",
              background: "#FFF",
              fontSize: "14px",
            }}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            style={{
              marginLeft: "12px",
              padding: "8px 14px",
              background: "#4B2E19",
              color: "#FFF",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Update
          </button>
        </form>
      </div>

      {/* ITEMS LIST */}
      <h2 style={{ marginBottom: "10px" }}>Items</h2>

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
