"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box, Typography, Divider, List, ListItem,
  ListItemAvatar, Avatar, ListItemText,
  Stack, Button, Paper, CircularProgress
} from "@mui/material";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`/api/orders/${id}`, { credentials: "include" });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const data = contentType.includes("application/json")
          ? await res.json()
          : { error: "Failed to load" };

        setError(data.error || "Unexpected error");
        return;
      }

      const data = await res.json();
      setOrder(data);
    }

    load();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading order...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Order #{order.id}</Typography>

      <Typography sx={{ mt: 1 }}>
        Status: <b>{order.status}</b>
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Placed: {new Date(order.createdAt).toLocaleString()}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Payment: <b>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</b>
      </Typography>

      {order.shipping && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6">Shipping</Typography>
          <Typography>Name: {order.shipping.fullName}</Typography>
          <Typography>Mobile: {order.shipping.mobile}</Typography>
          <Typography>Address: {order.shipping.address}</Typography>
          {order.shipping.notes && <Typography>Notes: {order.shipping.notes}</Typography>}
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5">Items</Typography>

      <List>
        {order.items.map((i) => (
          <ListItem key={i.id}>
            <ListItemAvatar>
              <Avatar variant="rounded" src={i.thumbnail} />
            </ListItemAvatar>
            <ListItemText
              primary={i.title}
              secondary={`₱${i.price} × ${i.quantity}`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5">Total: ₱{order.totalPrice}</Typography>

      <Button sx={{ mt: 3 }} variant="outlined" onClick={() => router.push("/orders")}>
        Back to Orders
      </Button>
    </Box>
  );
}
