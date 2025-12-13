import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import "./styles.css";

import { CartProvider } from "./context/CartContext";
import { ReviewProvider } from "./context/ReviewContext";
import { OrderProvider } from "./context/OrderContext";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";

function Root() {
  const mode: "light" | "dark" = "light";

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <NotificationProvider>
        <UserProvider>
          <CartProvider>
            <ReviewProvider>
              <OrderProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </OrderProvider>
            </ReviewProvider>
          </CartProvider>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
