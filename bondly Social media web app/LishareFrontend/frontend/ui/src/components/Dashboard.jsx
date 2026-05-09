import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("user/dashboard", { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
        else setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main", fontWeight: 700 }}>
        {error}
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary", fontWeight: 700 }}>
        Loading...
      </Box>
    );
  }

  const cards = [
    { title: "Welcome", value: data.welcomeMessage, color: "#e91e63" },
    { title: "Notifications", value: data.notifications, color: "#2563eb", large: true },
    { title: "Tasks", value: data.tasks, color: "#f59e0b", large: true },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: { xs: 3, sm: 5 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "#2563eb", mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome back! Here is an overview of your system.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
          {cards.map((card) => (
            <Paper key={card.title} sx={{ flex: 1, p: 2.5, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ color: card.color, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant={card.large ? "h4" : "body1"} sx={{ fontWeight: card.large ? 800 : 500 }}>
                {card.value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
          <Button variant="contained" onClick={() => navigate("/profile")}>
            Go to Profile
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/supportAdmin")}>
            Go to Support Panel
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
