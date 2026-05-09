// src/components/Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Navbar from "./Navbar";
import api from "../api";

const backendBaseUrl = "http://localhost:4041";

export default function Settings() {
  const navigate = useNavigate();
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
    api
      .get("/user/me", { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setUser(data);
        setNameForm({ name: data.firstName || "", lastName: data.lastName || "" });
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login");
        else setError("Failed to fetch user profile");
      });
  }, [navigate]);

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
      const res = await api.put("/user/update-name", nameForm, { withCredentials: true });
      showMessage(res.data?.message || "Name updated!");
      setUser((prev) => ({ ...prev, firstName: nameForm.name, lastName: nameForm.lastName }));
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update name", true);
    } finally {
      setLoading(false);
    }
  };

  const requestEmailUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put(
        "/user/update-email",
        { newEmail: emailForm.newEmail },
        { withCredentials: true }
      );
      showMessage(res.data?.message || "OTP sent to new email.");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to request email update", true);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        "/user/verify-new-email",
        null,
        { params: { otp: emailForm.otp }, withCredentials: true }
      );
      showMessage(res.data?.message || "Email verified! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to verify email", true);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      const res = await api.put("/user/update-password", passwordForm, { withCredentials: true });
      showMessage(res.data?.message || "Password updated! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update password", true);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone!")) return;
    setLoading(true);
    try {
      const res = await api.delete("/user/delete", {
        data: deleteForm,
        withCredentials: true,
      });
      showMessage(res.data?.message || "Account deleted. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete account", true);
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/user/delete-forgot-request", {}, { withCredentials: true });
      showMessage(res.data?.message || "OTP sent to your email.");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to request delete OTP", true);
    } finally {
      setLoading(false);
    }
  };

  const verifyDeleteOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        "/user/delete-forgot-verify",
        deleteOtpForm,
        { withCredentials: true }
      );
      showMessage(res.data?.message || "Account deleted. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to verify delete OTP", true);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, endpoint) => {
    if (!file) return showMessage("Please choose a file first", true);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showMessage("Upload successful!");
      // Refresh user profile
      const profileRes = await api.get("/user/me", { withCredentials: true });
      setUser(profileRes.data);
    } catch (err) {
      showMessage(err.response?.data?.message || "Upload failed", true);
    } finally {
      setUploading(false);
    }
  };

  const cardSx = { p: 2.5, borderRadius: 2, border: "1px solid #dde5f0" };
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Your profile";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        {/* Profile Header Card */}
        <Paper sx={{ mb: 3, overflow: "hidden", borderRadius: 2, border: "1px solid #dde5f0" }}>
          <Box sx={{ position: "relative", height: 200, bgcolor: "#dde5f0" }}>
            {user.coverImageUrl && (
              <Box
                component="img"
                src={backendBaseUrl + user.coverImageUrl}
                alt="Cover"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <Avatar
              src={user.profileImageUrl ? backendBaseUrl + user.profileImageUrl : undefined}
              sx={{
                width: 112,
                height: 112,
                border: "4px solid #fff",
                bgcolor: "#2563eb",
                position: "absolute",
                bottom: -56,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 48,
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
          </Box>
          <Box sx={{ pt: 8, pb: 2.5, textAlign: "center" }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "#333" }}>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your account details and security
            </Typography>
          </Box>
        </Paper>

        <Stack spacing={2.5}>
          {message && <Alert severity="success" onClose={() => setMessage("")}>{message}</Alert>}
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

          {/* Profile Images */}
          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: 700 }}>
              Profile Images
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap">
              <Button variant="outlined" component="label" sx={{ borderColor: "#2196f3", color: "#2196f3" }}>
                Choose Profile Photo
                <input hidden type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files[0])} />
              </Button>
              {profileFile && (
                <Typography variant="body2" sx={{ color: "#666", alignSelf: "center" }}>
                  {profileFile.name}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={() => uploadFile(profileFile, "/user/upload-profile-image")}
                disabled={uploading || !profileFile}
                sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
              >
                Upload Profile
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Button variant="outlined" component="label" sx={{ borderColor: "#e91e63", color: "#e91e63" }}>
                Choose Cover Photo
                <input hidden type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
              </Button>
              {coverFile && (
                <Typography variant="body2" sx={{ color: "#666", alignSelf: "center" }}>
                  {coverFile.name}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={() => uploadFile(coverFile, "/user/upload-cover-image")}
                disabled={uploading || !coverFile}
                sx={{ bgcolor: "#e91e63", "&:hover": { bgcolor: "#c2185b" } }}
              >
                Upload Cover
              </Button>
            </Stack>
          </Paper>

          {/* Update Name */}
          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: 700 }}>
              Update Name
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="First Name"
                value={nameForm.name}
                onChange={(e) => setNameForm({ ...nameForm, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={nameForm.lastName}
                onChange={(e) => setNameForm({ ...nameForm, lastName: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={updateName}
                disabled={loading}
                sx={{ minWidth: 100, bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
              >
                Save
              </Button>
            </Stack>
          </Paper>

          {/* Update Email */}
          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: 700 }}>
              Update Email
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 1.5 }}>
              <TextField
                label="New Email"
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={requestEmailUpdate}
                disabled={loading}
                sx={{ minWidth: 130, bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
              >
                Request OTP
              </Button>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="Enter OTP"
                value={emailForm.otp}
                onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={verifyEmail}
                disabled={loading}
                sx={{ minWidth: 130 }}
              >
                Verify OTP
              </Button>
            </Stack>
          </Paper>

          {/* Update Password */}
          <Paper sx={cardSx}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: 700 }}>
              Update Password
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={updatePassword}
                disabled={loading}
                sx={{ minWidth: 130, bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
              >
                Update
              </Button>
            </Stack>
          </Paper>

          {/* Delete Account */}
          <Paper sx={{ ...cardSx, borderColor: "#fca5a5" }}>
            <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 700 }}>
              Delete Account
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 1.5 }}>
              <TextField
                label="Current Password"
                type="password"
                value={deleteForm.currentPassword}
                onChange={(e) => setDeleteForm({ currentPassword: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                color="error"
                onClick={deleteAccount}
                disabled={loading}
                sx={{ minWidth: 140 }}
              >
                Delete Account
              </Button>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button variant="outlined" color="error" onClick={requestDeleteOtp} disabled={loading}>
                Request Delete OTP
              </Button>
              <TextField
                label="Delete OTP"
                value={deleteOtpForm.otp}
                onChange={(e) => setDeleteOtpForm({ otp: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                color="error"
                onClick={verifyDeleteOtp}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                Verify &amp; Delete
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
