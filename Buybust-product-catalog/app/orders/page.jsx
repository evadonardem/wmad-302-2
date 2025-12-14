import { redirect } from "next/navigation";
import { getUserFromCookie } from "@/lib/auth-server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import Link from "next/link";

export default async function OrdersPage() {
  const user = await getUserFromCookie();

  if (!user) redirect("/login");

  await connectDB();

  const orders = await Order.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <Box sx={{ p: 4, background: "#EEE5DA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#4B2E19",
          textAlign: "center",
          mb: 4,
        }}
      >
        Your Orders
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {orders.length === 0 && (
          <Typography sx={{ color: "#6F4E37" }}>
            You have no orders yet.
          </Typography>
        )}

        {orders.map((order) => {
          const firstItem = order.items?.[0];
          const thumbnail =
            firstItem?.thumbnail ||
            firstItem?.image ||
            firstItem?.img ||
            firstItem?.images?.[0] ||
            "/placeholder.png";

          return (
            <Grid item key={order._id} xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 0,
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "#F7ECE2",
                  border: "1px solid #D4B8A6",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* PRODUCT IMAGE */}
                <Box
                  component="img"
                  src={thumbnail}
                  alt="Product image"
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderBottom: "1px solid #D4B8A6",
                  }}
                />

                {/* CONTENT */}
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Order #{order._id.toString()}
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    Placed:{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    Status: <b>{order.status}</b>
                  </Typography>

                  <Divider sx={{ mb: 1 }} />

                  {order.items.slice(0, 3).map((item) => (
                    <Typography key={item.id}>
                      • {item.title} × {item.quantity}
                    </Typography>
                  ))}

                  {order.items.length > 3 && (
                    <Typography sx={{ mt: 1 }}>
                      + {order.items.length - 3} more…
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Typography sx={{ fontWeight: 700, mb: 2 }}>
                    Total: ₱{order.totalPrice.toFixed(2)}
                  </Typography>

                  <Link href={`/orders/${order._id}`}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background: "#6F4E37",
                        "&:hover": { background: "#4B2E19" },
                      }}
                    >
                      View Details
                    </Button>
                  </Link>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
