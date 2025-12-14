// app/orders/page.jsx
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import Link from "next/link";

export default async function OrdersPage() {
  await connectDB();

  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Order History
      </Typography>

      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order._id.toString()}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Order #{order._id.toString()}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                {new Date(order.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Status: <b>{order.status}</b>
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Items: {order.items.length}
              </Typography>

              <Link href={`/orders/${order._id.toString()}`}>
                <Button variant="outlined">View details</Button>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
