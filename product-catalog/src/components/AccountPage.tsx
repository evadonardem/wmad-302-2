import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import AddressDialog from "./AddressDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

const BLACK = "#000";
const DARK = "#333";
const BORDER = "rgba(0,0,0,0.15)";

export default function AccountPage() {
  const { user, users, register, logout, setProfilePic, switchUser } = useUser();
  const { addNotification } = useNotification();

  const [password, setPassword] = useState("");
  const [profilePic, setProfilePicState] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [openAddr, setOpenAddr] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openNewAccount, setOpenNewAccount] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* ================= CREATE ACCOUNT ================= */
  if (!user) {
    return (
      <Card
        sx={{
          maxWidth: 420,
          mx: "auto",
          borderRadius: 0,
          border: `1px solid ${BORDER}`,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Typography fontWeight={900} fontSize={20} color={BLACK}>
            Create Account
          </Typography>

          <TextField
            fullWidth
            label="Name"
            sx={{ mt: 2 }}
            InputLabelProps={{ style: { color: DARK } }}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            sx={{ mt: 2 }}
            InputLabelProps={{ style: { color: DARK } }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mt: 2 }}
            InputLabelProps={{ style: { color: DARK } }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => {
              register({ name, email, password, profilePic });
              addNotification("Account created");
            }}
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* ================= LOGGED-IN ACCOUNT ================= */
  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {/* PROFILE CARD */}
      <Card
        sx={{
          mb: 3,
          border: `1px solid ${BORDER}`,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.profilePic}
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "#e0e0e0",
                  color: BLACK,
                }}
              >
                {user.name?.slice(0, 1)}
              </Avatar>

              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: `1px solid ${BORDER}`,
                  color: DARK,
                }}
                onClick={() => fileRef.current?.click()}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box>
              <Typography fontWeight={900} fontSize={18} color={BLACK}>
                {user.name}
              </Typography>
              <Typography fontSize={14} color={DARK}>
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ACCOUNT ACTIONS CARD */}
      <Card
        sx={{
          mb: 3,
          border: `1px solid ${BORDER}`,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Typography fontWeight={900} color={BLACK} mb={2}>
            Account Actions
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              sx={{ justifyContent: "flex-start", color: BLACK }}
              onClick={() => setOpenPassword(true)}
            >
              Change Password
            </Button>

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              color="error"
              sx={{ justifyContent: "flex-start" }}
              onClick={logout}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ADDRESSES CARD */}
      <Card
        sx={{
          border: `1px solid ${BORDER}`,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight={900} color={BLACK}>
              Saved Addresses
            </Typography>
            <Button
              startIcon={<AddLocationAltIcon />}
              sx={{ color: BLACK }}
              onClick={() => setOpenAddr(true)}
            >
              Add Address
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {(user?.addresses?.length ?? 0) === 0 ? (
            <Typography color={DARK}>
              No saved addresses.
            </Typography>
          ) : (
            (user?.addresses || []).map((a: any) => (
              <Card
                key={a.id}
                sx={{
                  mb: 1,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <CardContent>
                  <Typography fontWeight={700} color={BLACK}>
                    {a.label}
                  </Typography>
                  <Typography fontSize={14} color={DARK}>
                    {a.details}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            setProfilePic(reader.result as string);
            setProfilePicState(reader.result as string);
            addNotification("Profile picture updated");
          };
          reader.readAsDataURL(f);
        }}
      />

      <AddressDialog open={openAddr} onClose={() => setOpenAddr(false)} />
      <ChangePasswordDialog
        open={openPassword}
        onClose={() => setOpenPassword(false)}
      />

      {/* ================= SWITCH / ADD ACCOUNT ================= */}
      <Card sx={{ mt: 3, border: `1px solid ${BORDER}`, backgroundColor: "#fff" }}>
        <CardContent>
          <Typography fontWeight={900} color={BLACK} mb={2}>
            Other Accounts
          </Typography>
          {users.length === 0 ? (
            <Typography color={DARK}>No other accounts</Typography>
          ) : (
            users
              .filter((u) => u.email !== user?.email)
              .map((u) => (
                <Stack key={u.email} direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                  <Avatar src={u.profilePic} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Typography fontWeight={700}>{u.name}</Typography>
                    <Typography variant="caption" color={DARK}>{u.email}</Typography>
                  </Box>
                  <Button sx={{ ml: "auto" }} onClick={() => switchUser(u.email)}>
                    Switch
                  </Button>
                </Stack>
              ))
          )}

          <Divider sx={{ my: 1 }} />
          <Button variant="outlined" onClick={() => setOpenNewAccount(true)}>
            Add Another Account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openNewAccount} onClose={() => setOpenNewAccount(false)}>
        <DialogTitle>Create Another Account</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" sx={{ mt: 1 }} value={newName} onChange={(e) => setNewName(e.target.value)} />
          <TextField fullWidth label="Email" sx={{ mt: 1 }} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" sx={{ mt: 1 }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewAccount(false)}>Cancel</Button>
          <Button onClick={() => {
            register({ name: newName, email: newEmail, password: newPassword });
            setOpenNewAccount(false);
            addNotification("Account added");
            setNewName(""); setNewEmail(""); setNewPassword("");
          }} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
