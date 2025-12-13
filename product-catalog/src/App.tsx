import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Container,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "./context/CartContext";
import { useUser } from "./context/UserContext";
import { useNotification } from "./context/NotificationContext";

import SideMenu from "./components/SideMenu";
import CartDrawer from "./components/CartDrawer";
import Dashboard from "./components/Dashboard";
import ProductSearch from "./components/ProductSearch";
import OrdersPage from "./components/OrdersPage";
import AccountPage from "./components/AccountPage";
import CategoryPage from "./components/CategoryPage";
import NotificationMenu from "./components/NotificationMenu";

type Page = "home" | "shop" | "categories" | "orders" | "account";

export default function App() {
  const { cart } = useCart();
  const { user } = useUser();
  const { notifications } = useNotification();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  return (
    <>
      {/* ================= APP BAR ================= */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton onClick={() => setMenuOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>

          <Typography sx={{ flexGrow: 1 }} fontWeight={900}>
            ShopEZ
          </Typography>

          {/* 🔔 NOTIFICATION BELL */}
          <IconButton
            color="inherit"
            onClick={(e) => setNotifAnchor(e.currentTarget)}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <Badge
              badgeContent={cart.reduce(
                (sum, i) => sum + i.quantity,
                0
              )}
              color="error"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={() => setPage("account")} aria-label="account">
            <Avatar
              src={user?.profilePic}
              sx={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.25)', bgcolor: 'background.paper', color: 'text.primary' }}
            >
              {user?.name?.slice(0, 1)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <NotificationMenu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={() => setNotifAnchor(null)}
      />

      {/* ================= SIDE MENU ================= */}
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigate={(p) => {
          setPage(p as Page);
          navigate("/");
          setMenuOpen(false);
        }}
      />

      {/* ================= CART DRAWER ================= */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        goToOrders={() => {
          setPage("orders");
          navigate("/orders");
        }}
      />

      {/* ================= MAIN CONTENT ================= */}
      <Container sx={{ mt: 10 }}>
        {page === "home" && (
          <Dashboard
            onStartShopping={() => {
              setPage("shop");
              navigate("/shop");
            }}
          />
        )}

        {page === "categories" && (
          <CategoryPage
            onSelectCategory={(cat) => {
              setPage("shop");
              navigate(`/shop?category=${cat}`);
            }}
          />
        )}

        {page === "shop" && <ProductSearch />}
        {page === "orders" && <OrdersPage />}
        {page === "account" && <AccountPage />}
      </Container>
    </>
  );
}
