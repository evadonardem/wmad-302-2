import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import type { Order } from "../context/OrderContext";

export default function OrderDetailDialog({
  open,
  order,
  onClose,
}: {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;

  const getColor = (status: string) => {
    if (status === "Placed") return "warning";
    if (status === "Shipped") return "info";
    return "success";
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Order Details</DialogTitle>

      <DialogContent>
        {/* PRODUCT */}
        <Box display="flex" gap={2} mb={2}>
          <img
            src={order.thumbnail}
            width={90}
            style={{ borderRadius: 8 }}
          />

          <Box>
            <Typography fontWeight={900}>{order.title}</Typography>
            <Typography color="error" fontWeight={900}>
              ${order.price}
            </Typography>
            <Typography variant="caption">
              Quantity: {order.quantity}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* STATUS */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Status</Typography>
          <Chip label={order.status} color={getColor(order.status)} />
        </Box>

        {/* DATE */}
        <Typography variant="body2">
          Ordered on: <b>{order.date}</b>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* ADDRESS */}
        <Typography fontWeight={700}>Delivery Address</Typography>
        <Typography>{order.address.label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {order.address.details}
        </Typography>

        {/* PAYMENT */}
        {order.paymentMethod && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={700}>Payment</Typography>
            <Typography>
              Method: <b>{order.paymentMethod}</b>
            </Typography>
            {order.paymentReference && (
              <Typography variant="body2">
                Reference: {order.paymentReference}
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
