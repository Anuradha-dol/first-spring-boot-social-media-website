import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Delete,
  Home,
  Lock,
  QuestionAnswer,
  Send,
  VerifiedUser,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import api from "../api";
import { openLiveStream } from "../live";

const statusInfo = (status) => {
  const value = status?.toUpperCase() || "OPEN";
  if (value === "ANSWERED") return { label: "Answered", color: "#0f9f9a", icon: <CheckCircle fontSize="small" /> };
  if (value === "CLOSED") return { label: "Closed", color: "#64748b", icon: <Lock fontSize="small" /> };
  return { label: "Open", color: "#e91e63", icon: <AccessTime fontSize="small" /> };
};

export default function SupportUser() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMyQuestions = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get("/support/my", { withCredentials: true });
      setQuestions(res.data);
    } catch {
      if (!silent) setError("Failed to load questions");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuestions();
    const stream = openLiveStream("/support/stream", {
      support: () => fetchMyQuestions(true),
    });
    const poll = setInterval(() => fetchMyQuestions(true), 7000);

    return () => {
      stream?.close();
      clearInterval(poll);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    try {
      const res = await api.post("/support", { question: questionText }, { withCredentials: true });
      setQuestions((prev) => [res.data, ...prev]);
      setQuestionText("");
    } catch {
      setError("Failed to submit question");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/support/${id}`, { withCredentials: true });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch {
      setError("Failed to delete");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 2,
            borderRadius: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #fff0f6 52%, #eef6ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: "#e91e63", width: 54, height: 54 }}>
              <QuestionAnswer />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: "#e91e63" }}>My Support</Typography>
              <Typography color="text.secondary">{questions.length} private conversation{questions.length !== 1 ? "s" : ""}</Typography>
            </Box>
          </Stack>
          <IconButton component={RouterLink} to="/home" sx={{ color: "#2563eb" }}>
            <Home />
          </IconButton>
        </Paper>

        {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
          <Paper sx={{ width: { xs: "100%", md: 360 }, p: 2, borderRadius: 1, position: { md: "sticky" }, top: 74 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <VerifiedUser sx={{ color: "#2563eb" }} />
              <Typography variant="h6" sx={{ color: "#172033" }}>Ask Admin</Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                minRows={5}
                placeholder="Type your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Button type="submit" variant="contained" endIcon={<Send />} fullWidth sx={{ bgcolor: "#e91e63" }}>
                Submit
              </Button>
            </Box>
          </Paper>

          <Box sx={{ flex: 1, width: "100%" }}>
            {loading ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 1 }}>
                <Typography color="text.secondary">Loading conversations...</Typography>
              </Paper>
            ) : questions.length === 0 ? (
              <Paper sx={{ p: { xs: 4, md: 7 }, textAlign: "center", borderRadius: 1 }}>
                <Avatar sx={{ bgcolor: alpha("#e91e63", 0.1), color: "#e91e63", mx: "auto", mb: 1.5, width: 64, height: 64 }}>
                  <QuestionAnswer />
                </Avatar>
                <Typography variant="h6" color="text.secondary">You haven't asked any questions yet.</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {questions.map((q) => {
                  const info = statusInfo(q.status);
                  return (
                    <Paper key={q.id} sx={{ p: 2, borderRadius: 1 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                        <Chip icon={info.icon} label={info.label} size="small" sx={{ bgcolor: alpha(info.color, 0.1), color: info.color, fontWeight: 700 }} />
                        <IconButton size="small" onClick={() => handleDelete(q.id)} sx={{ color: "#ef4444" }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Stack spacing={1.5}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Paper sx={{ maxWidth: "76%", p: 1.5, borderRadius: "8px 8px 2px 8px", bgcolor: alpha("#e91e63", 0.08), borderColor: alpha("#e91e63", 0.18) }}>
                            <Typography>{q.question}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {q.createdAt ? new Date(q.createdAt).toLocaleString() : ""}
                            </Typography>
                          </Paper>
                        </Box>

                        {q.adminResponse ? (
                          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <Paper sx={{ maxWidth: "76%", p: 1.5, borderRadius: "8px 8px 8px 2px", bgcolor: "#f8fafc" }}>
                              <Typography sx={{ color: "#2563eb", fontWeight: 700, mb: 0.5 }}>Admin</Typography>
                              <Typography>{q.adminResponse}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {q.updatedAt ? new Date(q.updatedAt).toLocaleString() : ""}
                              </Typography>
                            </Paper>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Waiting for admin reply...</Typography>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
