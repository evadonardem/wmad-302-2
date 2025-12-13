import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { useOrders } from "../context/OrderContext";
import type { Order } from "../context/OrderContext";
import OrderDetailDialog from "./OrderDetailDialog";

export default function OrdersPage() {
  const { orders } = useOrders();
  const [selected, setSelected] = useState<Order | null>(null);

  const getColor = (status: string) => {
    if (status === "Placed") return "warning";
    if (status === "Shipped") return "info";
    return "success";
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary">
          You have no orders yet.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {orders.map((o: Order) => (
            <Card
              key={o.id}
              sx={{ cursor: "pointer" }}
              onClick={() => setSelected(o)}
            >
              <CardContent sx={{ display: "flex", gap: 2 }}>
                <img
                  src={o.thumbnail}
                  width={90}
                  style={{ borderRadius: 8 }}
                />

                <Box flexGrow={1}>
                  <Typography fontWeight="bold">{o.title}</Typography>
                  <Typography color="error">${o.price}</Typography>
                  <Typography variant="caption">
                    Ordered on: {o.date}
                  </Typography>
                </Box>

                <Chip
                  label={o.status}
                  color={getColor(o.status)}
                  sx={{ height: 32 }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ORDER DETAILS DIALOG */}
      <OrderDetailDialog
        open={Boolean(selected)}
        order={selected}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
}
