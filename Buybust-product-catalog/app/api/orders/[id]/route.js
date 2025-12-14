// app/orders/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
  Button
} from "@mui/material";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load order");
          return;
        }

        setOrder(data);
      } catch (err) {
        setError("Failed to load order");
      }
    }

    load();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push("/orders")}>
          Back
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading order...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Order #{order.id}
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
            <ListItem key={item.id} sx={{ display: "flex", gap: 2 }}>
              <Avatar
                variant="rounded"
                src={item.thumbnail}
                sx={{ width: 60, height: 60 }}
              />

              <div>
                <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                <Typography>
                  ₱{item.price} × {item.quantity}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Total: ₱{order.totalPrice}
      </Typography>

      <Button sx={{ mt: 3 }} onClick={() => router.push("/orders")}>
        Back to Orders
      </Button>
    </Box>
  );
}
