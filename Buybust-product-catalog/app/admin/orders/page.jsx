"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Button,
} from "@mui/material";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/orders", {
          credentials: "include",
        });

        const data = await res.json();
        console.log("ADMIN ORDERS:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]); // failsafe
        }
      } catch (err) {
        console.error("Failed to load admin orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading admin orders…</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin — Orders
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {orders.length === 0 && (
            <Typography>No orders found.</Typography>
          )}

          {orders.map((o) => (
            <ListItem
              key={o.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #ddd",
                py: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  Order #{o.id}
                </Typography>
                <Typography>Status: {o.status}</Typography>
                <Typography>
                  Total: ₱{Number(o.totalPrice).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(o.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Link href={`/admin/orders/${o.id}`}>
                <Button variant="contained">View</Button>
              </Link>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
