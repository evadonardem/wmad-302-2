import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordDialog({
  open,
  onClose,
}: Props) {
  const { addNotification } = useNotification();
  const [password, setPassword] = useState("");

  const save = () => {
    if (!password.trim()) return;

    addNotification("🔐 Password changed successfully");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Change Password</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={password}
          sx={{ mt: 2 }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={!password.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
