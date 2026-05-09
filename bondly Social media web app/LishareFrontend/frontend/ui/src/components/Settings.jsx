// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const BASE_URL = "http://localhost:9091"; // your backend

export default function App() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Forms
  const [nameForm, setNameForm] = useState({ name: "", lastName: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "", otp: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deleteForm, setDeleteForm] = useState({ currentPassword: "" });
  const [deleteOtpForm, setDeleteOtpForm] = useState({ otp: "" });

  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Fetch user profile
  useEffect(() => {
    fetch(BASE_URL + "/user/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setNameForm({ name: data.firstName || "", lastName: data.lastName || "" });
      })
      .catch(() => setError("Failed to fetch user profile"));
  }, []);

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setMessage("");
    } else {
      setMessage(msg);
      setError("");
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);
  };

  // --- Handlers ---
  const updateName = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/user/update-name", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameForm),
      });
      await res.text();
      showMessage(data);
      setUser({ ...user, firstName: nameForm.name, lastName: nameForm.lastName });
    } catch {
      showMessage("Failed to update name", true);
    } finally {
      setLoading(false);
    }
  };

  const requestEmailUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/user/update-email", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: emailForm.newEmail }),
      });
      const data = await res.text();
      showMessage(data);
    } catch {
      showMessage("Failed to request email update", true);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + `/user/verify-new-email?otp=${emailForm.otp}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.text();
      showMessage(data);
      // Navigate to login after successful email verification
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch {
      showMessage("Failed to verify email", true);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/user/update-password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.text();
      showMessage(data);
      // Navigate to login after successful password update
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch {
      showMessage("Failed to update password", true);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/user/delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteForm),
      });
      const data = await res.text();
      showMessage(data);
      // Navigate to login after successful account deletion
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch {
      showMessage("Failed to delete account", true);
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/user/delete-forgot-request", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.text();
      showMessage(data);
    } catch {
      showMessage("Failed to request delete OTP", true);
    } finally {
      setLoading(false);
    }
  };

  const verifyDeleteOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/user/delete-forgot-verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteOtpForm),
      });
      const data = await res.text();
      showMessage(data);
      // Navigate to login after successful OTP deletion
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch {
      showMessage("Failed to verify delete OTP", true);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, endpoint) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(BASE_URL + endpoint, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.text();
      showMessage("Upload successful!");
      // Refresh user profile
      const profile = await fetch(BASE_URL + "/user/me", { credentials: "include" });
      setUser(await profile.json());
    } catch {
      showMessage("Upload failed", true);
    } finally {
      setUploading(false);
    }
  };

  const cardSx = { p: 2, borderRadius: 1, border: "1px solid #dde5f0" };
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Your profile";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="md">
        <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: 1 }}>
          <Box sx={{ position: "relative", height: 210, bgcolor: "#dde5f0" }}>
            {user.coverImageUrl && (
              <Box
                component="img"
                src={BASE_URL + user.coverImageUrl}
                alt="Cover"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <Avatar
              src={user.profileImageUrl ? BASE_URL + user.profileImageUrl : undefined}
              sx={{
                width: 112,
                height: 112,
                border: "4px solid #fff",
                bgcolor: "#2563eb",
                position: "absolute",
                bottom: -56,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
          </Box>
          <Box sx={{ pt: 7.5, pb: 2, textAlign: "center" }}>
            <Typography variant="h5">{fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage account details and security
            </Typography>
          </Box>
        </Paper>

        <Stack spacing={2}>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Profile Images</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button variant="outlined" component="label">
                Choose Profile
                <input hidden type="file" onChange={(e) => setProfileFile(e.target.files[0])} />
              </Button>
              <Button variant="contained" onClick={() => uploadFile(profileFile, "/user/upload-profile-image")} disabled={uploading}>
                Upload Profile
              </Button>
              <Button variant="outlined" component="label">
                Choose Cover
                <input hidden type="file" onChange={(e) => setCoverFile(e.target.files[0])} />
              </Button>
              <Button variant="contained" color="secondary" onClick={() => uploadFile(coverFile, "/user/upload-cover-image")} disabled={uploading}>
                Upload Cover
              </Button>
            </Stack>
          </Paper>

          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Update Name</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField label="First Name" value={nameForm.name} onChange={(e) => setNameForm({ ...nameForm, name: e.target.value })} fullWidth />
              <TextField label="Last Name" value={nameForm.lastName} onChange={(e) => setNameForm({ ...nameForm, lastName: e.target.value })} fullWidth />
              <Button variant="contained" onClick={updateName} disabled={loading} sx={{ minWidth: 120 }}>Save</Button>
            </Stack>
          </Paper>

          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Update Email</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 1.5 }}>
              <TextField label="New Email" type="email" value={emailForm.newEmail} onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })} fullWidth />
              <Button variant="contained" onClick={requestEmailUpdate} disabled={loading} sx={{ minWidth: 130 }}>Request OTP</Button>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField label="OTP" value={emailForm.otp} onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value })} fullWidth />
              <Button variant="contained" color="secondary" onClick={verifyEmail} disabled={loading} sx={{ minWidth: 130 }}>Verify</Button>
            </Stack>
          </Paper>

          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Update Password</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} fullWidth />
              <TextField label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} fullWidth />
              <TextField label="Confirm Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} fullWidth />
              <Button variant="contained" onClick={updatePassword} disabled={loading} sx={{ minWidth: 130 }}>Update</Button>
            </Stack>
          </Paper>

          <Paper sx={{ ...cardSx, borderColor: "#fca5a5" }}>
            <Typography variant="h6" color="error" sx={{ mb: 1.5 }}>Delete Account</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 1.5 }}>
              <TextField label="Current Password" type="password" value={deleteForm.currentPassword} onChange={(e) => setDeleteForm({ currentPassword: e.target.value })} fullWidth />
              <Button variant="contained" color="error" onClick={deleteAccount} disabled={loading} sx={{ minWidth: 140 }}>Delete</Button>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button variant="outlined" color="error" onClick={requestDeleteOtp} disabled={loading}>Request Delete OTP</Button>
              <TextField label="Delete OTP" value={deleteOtpForm.otp} onChange={(e) => setDeleteOtpForm({ otp: e.target.value })} fullWidth />
              <Button variant="contained" color="error" onClick={verifyDeleteOtp} disabled={loading} sx={{ minWidth: 150 }}>Verify Delete</Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
