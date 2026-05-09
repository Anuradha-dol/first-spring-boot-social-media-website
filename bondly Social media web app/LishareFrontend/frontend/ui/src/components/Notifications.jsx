import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../api";
import { openLiveStream } from "../live";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Home as HomeIcon, NotificationsActive, PersonAdd, FiberManualRecord } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const getInitials = (firstName, lastName) =>
  `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "B";

const isFollowNotice = (notice) => notice.type === "FOLLOW" || notice.type === "follower" || notice.isFollower;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [processingIds, setProcessingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await api.get("/notifications", { withCredentials: true });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      if (!silent) setError("Failed to load notifications");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const stream = openLiveStream("/notifications/stream", {
      notification: () => fetchNotifications(true),
    });
    const poll = setInterval(() => fetchNotifications(true), 7000);

    return () => {
      stream?.close();
      clearInterval(poll);
    };
  }, []);

  const handleFollowToggle = async (notice) => {
    if (!notice.userId || processingIds.includes(notice.userId)) return;

    setProcessingIds((prev) => [...prev, notice.userId]);
    const currentlyFollowing = notice.isFollowing;
    setNotifications((prev) =>
      prev.map((item) => item.userId === notice.userId ? { ...item, isFollowing: !currentlyFollowing } : item)
    );

    try {
      if (currentlyFollowing) {
        await api.delete(`/follow/${notice.userId}/unfollow`, { withCredentials: true });
      } else {
        await api.post(`/follow/${notice.userId}/follow`, {}, { withCredentials: true });
      }
    } catch (err) {
      console.error(err);
      setNotifications((prev) =>
        prev.map((item) => item.userId === notice.userId ? { ...item, isFollowing: currentlyFollowing } : item)
      );
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== notice.userId));
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 2,
            borderRadius: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #eef6ff 58%, rgba(233,30,99,0.08) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Badge badgeContent={unreadCount} color="primary">
              <Avatar sx={{ bgcolor: "#e91e63", width: 52, height: 52 }}>
                <NotificationsActive />
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h4" sx={{ color: "#e91e63" }}>Notifications</Typography>
              <Typography color="text.secondary">{notifications.length} live update{notifications.length !== 1 ? "s" : ""}</Typography>
            </Box>
          </Stack>
          <IconButton component={RouterLink} to="/home" sx={{ color: "#2563eb" }}>
            <HomeIcon />
          </IconButton>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
          <Paper sx={{ width: { xs: "100%", md: 280 }, p: 2, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: "#2563eb", mb: 1 }}>Live Center</Typography>
            <Stack spacing={1}>
              <Chip label={`${unreadCount} unread`} color="primary" variant="outlined" />
              <Chip label="Auto refresh on" color="secondary" variant="outlined" />
            </Stack>
          </Paper>

          <Paper sx={{ flex: 1, width: "100%", borderRadius: 1, overflow: "hidden" }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: { xs: 4, md: 7 }, textAlign: "center" }}>
                <Avatar sx={{ bgcolor: alpha("#2563eb", 0.1), color: "#2563eb", mx: "auto", mb: 1.5, width: 64, height: 64 }}>
                  <NotificationsActive />
                </Avatar>
                <Typography variant="h6" color="text.secondary">No notifications yet.</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notice) => (
                  <ListItem
                    key={notice.id || `${notice.type}-${notice.userId}`}
                    alignItems="flex-start"
                    secondaryAction={
                      isFollowNotice(notice) && notice.userId && (
                        <Button
                          variant={notice.isFollowing ? "outlined" : "contained"}
                          onClick={() => handleFollowToggle(notice)}
                          disabled={processingIds.includes(notice.userId)}
                          size="small"
                          sx={notice.isFollowing ? { borderColor: "#2563eb", color: "#2563eb" } : { bgcolor: "#e91e63" }}
                        >
                          {notice.isFollowing ? "Unfollow" : "Follow Back"}
                        </Button>
                      )
                    }
                    sx={{
                      px: { xs: 2, md: 2.5 },
                      py: 1.5,
                      borderBottom: "1px solid #dde5f0",
                      "&:hover": { bgcolor: "#f8fafc" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: isFollowNotice(notice) ? "#2563eb" : "#e91e63" }}>
                        {getInitials(notice.firstName, notice.lastName)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {!notice.read && <FiberManualRecord sx={{ color: "#e91e63", fontSize: 10 }} />}
                          <Typography sx={{ fontWeight: 700, color: "#172033" }}>
                            {notice.message || `${notice.firstName || "Someone"} ${notice.lastName || ""}`}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {notice.createdAt ? new Date(notice.createdAt).toLocaleString() : "Just now"}
                          </Typography>
                          {isFollowNotice(notice) && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <PersonAdd sx={{ fontSize: 16, color: "#2563eb" }} />
                              <Typography variant="caption" color="text.secondary">
                                {notice.isFollowing ? "You follow back" : "New follower"}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
