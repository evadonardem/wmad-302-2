import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useNotification } from "../context/NotificationContext";

export default function NotificationMenu({
  anchorEl,
  open,
  onClose,
}: any) {
  const { notifications, markAllRead } = useNotification();

  const handleClose = () => {
    markAllRead();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: 320 } }}
    >
      <Box px={2} py={1}>
        <Typography fontWeight={900}>Notifications</Typography>
      </Box>

      <Divider />

      {notifications.length === 0 && (
        <MenuItem disabled>No notifications</MenuItem>
      )}

      {notifications.map((n) => (
        <MenuItem
          key={n.id}
          sx={{
            backgroundColor: n.read
              ? "transparent"
              : "rgba(0,0,0,0.06)",
            whiteSpace: "normal",
          }}
        >
          <Typography fontSize={14}>{n.message}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
}
