// ❗ THIS MUST BE A SERVER COMPONENT — NO "use client"

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
} from "@mui/material";

export default async function AdminOrderDetails({ params }) {
  await connectDB();

  // ⭐ params is safe here because this is a SERVER COMPONENT
  const { id } = params;

  const order = await Order.findById(id).lean();

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Order not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin — Order #{order._id.toString()}
      </Typography>

      <Typography sx={{ mb: 1 }}>
        Created: {new Date(order.createdAt).toLocaleString()}
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Status: <b>{order.status}</b>
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {order.items.map((item) => (
            <ListItem key={item.id} sx={{ gap: 2 }}>
              <Avatar
                variant="rounded"
                src={item.thumbnail}
                alt={item.title}
                sx={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography>
                  ₱{item.price} × {item.quantity}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ₱{order.totalPrice}
      </Typography>
    </Box>
  );
}
