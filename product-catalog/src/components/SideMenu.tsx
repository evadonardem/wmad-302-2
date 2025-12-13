import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpDialog from "./HelpDialog";
import { useUser } from "../context/UserContext";
import React from "react";

type Page = "home" | "shop" | "orders" | "account" | "categories";

type Props = {
  open: boolean;
  onClose: () => void;
  navigate: (page: Page) => void;
};

export default function SideMenu({ open, onClose, navigate }: Props) {
  const { user, logout } = useUser();
  const [helpOpen, setHelpOpen] = React.useState(false);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: 280,
          background: 'var(--card)',
          color: 'var(--text-card)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ px: 0 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          onClick={() => navigate("account") as void}
          sx={{
            cursor: "pointer",
            p: 2,
            background: 'linear-gradient(90deg, var(--primary), var(--primary-2))',
            color: '#fff',
          }}
        >
          <Avatar src={user?.profilePic} sx={{ width: 56, height: 56, border: '2px solid rgba(255,255,255,0.25)' }}>

            {user?.name?.slice(0,1)}
          </Avatar>
          <div>
            <Typography fontWeight={900} sx={{ color: '#fff' }}>
              {user ? user.name : "Guest"}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {user ? user.email : "Sign in / Create account"}
            </Typography>
          </div>
        </Box>
      </Box>
      <Divider />
      <List sx={{ width: 240 }}>
        <ListItemButton onClick={() => navigate("home")}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("shop")}>
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary="Shop" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("categories")}>
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("orders")}>
          <ListItemIcon><ReceiptIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("account")} sx={{ '&:hover': { backgroundColor: 'rgba(21,101,192,0.06)' } }}>
          <ListItemIcon sx={{ color: 'var(--primary)' }}><PersonIcon /></ListItemIcon>
          <ListItemText primary="Account" />
        </ListItemButton>
        <ListItemButton onClick={() => { logout(); navigate('home'); onClose(); }} sx={{ mt: 1, '&:hover': { backgroundColor: 'rgba(21,101,192,0.06)' } }}>
          <ListItemIcon sx={{ color: 'var(--primary)' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
        <ListItemButton onClick={() => { setHelpOpen(true); onClose(); }} sx={{ mt: 0.5, '&:hover': { backgroundColor: 'rgba(21,101,192,0.06)' } }}>
          <ListItemIcon sx={{ color: 'var(--primary)' }}><HelpOutlineIcon /></ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItemButton>
      </List>
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Drawer>
  );
}
