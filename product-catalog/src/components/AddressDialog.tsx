import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function AddressDialog({ open, onClose }: any) {
  const { addAddress } = useUser();
  const [label, setLabel] = useState("");
  const [details, setDetails] = useState("");

  const save = () => {
    addAddress({
      id: Date.now(),
      label,
      details,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Address</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Label (Home, Office)"
          sx={{ mt: 2 }}
          onChange={(e) => setLabel(e.target.value)}
        />
        <TextField
          fullWidth
          multiline
          label="Full Address"
          sx={{ mt: 2 }}
          onChange={(e) => setDetails(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
