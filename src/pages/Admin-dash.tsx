import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type MockUser = { email: string; name: string; role: string };

const mockUsers: MockUser[] = [
  { email: "dexter@example.com", name: "Dexter", role: "customer" },
  { email: "admin@example.com", name: "Admin", role: "admin" },
];

const mockActivities = [
  { id: 1, who: "Dexter", action: "Signed in", when: "2025-12-11 09:12" },
  { id: 2, who: "Bob", action: "Added item to cart", when: "2025-12-11 10:04" },
  { id: 3, who: "Admin", action: "Updated product price", when: "2025-12-12 08:21" },
];

export default function AdminDash() {
  const navigate = useNavigate();
  useEffect(() => {
    const raw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.role !== "admin") {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  const [tab, setTab] = useState(0);
  const [users] = useState(mockUsers);
  const [activities] = useState(mockActivities);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setCart(JSON.parse(raw));
  }, []);

  const totalCartItems = useMemo(() => cart.reduce((s, i) => s + (i.quantity || 0), 0), [cart]);

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const handleExportActivities = () => {
    const csv = activities
      .map((a) => `${a.id},"${a.who}","${a.action}","${a.when}"`)
      .join("\n");
    const blob = new Blob(["id,who,action,when\n", csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activities.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredActivities = useMemo(() => {
    if (!selectedUser) return activities;
    return activities.filter((a) => a.who === selectedUser.name);
  }, [activities, selectedUser]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Box>
          <Button variant="outlined" onClick={() => navigate('/home')} sx={{ mr: 2 }}>
            Back to site
          </Button>
        </Box>
      </Box>

      <Paper>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary">
          <Tab label="Users" />
          <Tab label="Activities" />
          <Tab label={`Carts (${totalCartItems})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Registered Users
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar>{u.name.charAt(0)}</Avatar>
                          <Typography>{u.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => {
                          // view user's activities in the Activities tab instead of impersonating
                          setSelectedUser(u);
                          setTab(1);
                        }}>View Activity</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">Recent Activities</Typography>
                  {selectedUser && (
                    <Typography variant="body2">Viewing activities for {selectedUser.name} — <Button size="small" onClick={() => setSelectedUser(null)}>Show all</Button></Typography>
                  )}
                </Box>
                <Box>
                  <Button onClick={handleExportActivities} sx={{ mr: 1 }}>Export</Button>
                </Box>
              </Box>

              <List>
                {filteredActivities.map((a) => (
                  <React.Fragment key={a.id}>
                    <ListItem>
                      <ListItemText primary={`${a.who} — ${a.action}`} secondary={a.when} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Current Application Cart (localStorage)</Typography>
                <Button color="error" variant="outlined" onClick={handleClearCart}>Clear Cart</Button>
              </Box>

              {cart.length === 0 ? (
                <Typography>No items in stored cart.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>${(item.price || 0).toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
