import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import React from "react";

export default function SelectAddressDialog({
  open,
  onClose,
  onSelect,
}: any) {
  const { user } = useUser();
  const addresses = user?.addresses || [];
  const [selected, setSelected] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "GCASH" | "MAYA" | "PAYPAL" | "COD"
  >("COD");
  const [paymentRef, setPaymentRef] = useState<string>("");

  const itemStyle = (active: boolean) => ({
    mb: 1,
    borderRadius: 2,
    border: active ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.12)",
    backgroundColor: active ? "rgba(25,118,210,0.08)" : "transparent",
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Delivery Address</DialogTitle>

      <DialogContent>
        {/* ================= ADDRESSES ================= */}
        <List>
          {addresses.map((a: any, i: number) => {
            const active = selected === i;
            return (
              <ListItemButton
                key={i}
                onClick={() => setSelected(i)}
                sx={itemStyle(active)}
              >
                <ListItemText
                  primary={a.label}
                  secondary={a.details}
                />
                {active && <CheckCircleIcon color="primary" />}
              </ListItemButton>
            );
          })}
        </List>

        {/* ================= PAYMENT ================= */}
        <Box mt={2} mb={1} fontWeight={900}>
          Payment Method
        </Box>

        <List>
          {[
            { key: "GCASH", label: "GCash", desc: "Pay via GCash" },
            { key: "MAYA", label: "Maya", desc: "Pay via Maya" },
            { key: "PAYPAL", label: "PayPal", desc: "Pay via PayPal" },
            { key: "COD", label: "Cash on Delivery", desc: "Pay on delivery" },
          ].map((p) => {
            const active = paymentMethod === p.key;
            return (
              <ListItemButton
                key={p.key}
                onClick={() => setPaymentMethod(p.key as any)}
                sx={itemStyle(active)}
              >
                <ListItemText
                  primary={p.label}
                  secondary={p.desc}
                />
                {active && <CheckCircleIcon color="primary" />}
              </ListItemButton>
            );
          })}
        </List>

        {/* ================= PAYMENT REF ================= */}
        {(paymentMethod === "GCASH" ||
          paymentMethod === "MAYA" ||
          paymentMethod === "PAYPAL") && (
          <Box mt={2}>
              <TextField
              fullWidth
              label={`${paymentMethod} Reference (optional)`}
              value={paymentRef}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentRef(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          disabled={selected === null}
          onClick={() =>
            onSelect(addresses[selected!], {
              method: paymentMethod,
              reference: paymentRef || null,
            })
          }
        >
          Confirm Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}
