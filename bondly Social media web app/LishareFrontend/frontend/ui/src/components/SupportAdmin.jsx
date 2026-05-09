import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { alpha } from "@mui/material/styles";
import {
  AccessTime,
  ArrowBack,
  CheckCircle,
  Lock,
  Person,
  QuestionAnswer,
  Send,
} from "@mui/icons-material";
import api from "../api";
import { openLiveStream } from "../live";

const statusInfo = (status) => {
  const value = status?.toUpperCase() || "OPEN";
  if (value === "ANSWERED") return { label: "Answered", color: "#0f9f9a", icon: <CheckCircle fontSize="small" /> };
  if (value === "CLOSED") return { label: "Closed", color: "#64748b", icon: <Lock fontSize="small" /> };
  return { label: "Open", color: "#e91e63", icon: <AccessTime fontSize="small" /> };
};

export default function SupportAdmin() {
  const [questions, setQuestions] = useState([]);
  const [responseText, setResponseText] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllQuestions = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get("/support", { withCredentials: true });
      setQuestions(res.data);
    } catch {
      if (!silent) setError("Failed to load questions");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
    const stream = openLiveStream("/support/stream", {
      support: () => fetchAllQuestions(true),
    });
    const poll = setInterval(() => fetchAllQuestions(true), 7000);

    return () => {
      stream?.close();
      clearInterval(poll);
    };
  }, []);

  const handleRespond = async (id) => {
    if (!responseText[id]?.trim()) return;
    try {
      const res = await api.put(
        `/support/${id}/respond`,
        { response: responseText[id] },
        { withCredentials: true }
      );
      setQuestions((prev) => prev.map((q) => (q.id === id ? res.data : q)));
      setResponseText((prev) => ({ ...prev, [id]: "" }));
    } catch {
      setError("Failed to respond");
    }
  };

  const openCount = questions.filter((q) => statusInfo(q.status).label === "Open").length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 2,
            borderRadius: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #eef6ff 48%, rgba(233,30,99,0.08) 100%)",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: "#2563eb", width: 54, height: 54 }}>
                <QuestionAnswer />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ color: "#2563eb" }}>Support Inbox</Typography>
                <Typography color="text.secondary">{questions.length} private conversation{questions.length !== 1 ? "s" : ""}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip label={`${openCount} open`} sx={{ bgcolor: alpha("#e91e63", 0.1), color: "#e91e63", fontWeight: 700 }} />
              <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 1 }}>
            <Typography color="text.secondary">Loading support inbox...</Typography>
          </Paper>
        ) : questions.length === 0 ? (
          <Paper sx={{ p: { xs: 4, md: 7 }, textAlign: "center", borderRadius: 1 }}>
            <Avatar sx={{ bgcolor: alpha("#2563eb", 0.1), color: "#2563eb", mx: "auto", mb: 1.5, width: 64, height: 64 }}>
              <QuestionAnswer />
            </Avatar>
            <Typography variant="h6" color="text.secondary">No questions yet.</Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            {questions.map((q) => {
              const info = statusInfo(q.status);
              return (
                <Paper key={q.id} sx={{ p: 2, borderRadius: 1 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ bgcolor: alpha("#e91e63", 0.12), color: "#e91e63" }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{q.username}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.createdAt ? new Date(q.createdAt).toLocaleString() : ""}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip icon={info.icon} label={info.label} size="small" sx={{ bgcolor: alpha(info.color, 0.1), color: info.color, fontWeight: 700 }} />
                  </Stack>

                  <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: "#fff8fb", borderColor: alpha("#e91e63", 0.18), mb: 1.5 }}>
                    <Typography>{q.question}</Typography>
                  </Paper>

                  {q.adminResponse ? (
                    <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: "#f8fafc" }}>
                      <Typography sx={{ color: "#2563eb", fontWeight: 800, mb: 0.5 }}>Admin reply</Typography>
                      <Typography>{q.adminResponse}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {q.updatedAt ? new Date(q.updatedAt).toLocaleString() : ""}
                      </Typography>
                    </Paper>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <TextField
                        placeholder="Reply privately..."
                        value={responseText[q.id] || ""}
                        onChange={(e) => setResponseText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        fullWidth
                      />
                      <IconButton
                        onClick={() => handleRespond(q.id)}
                        disabled={!responseText[q.id]?.trim()}
                        sx={{ bgcolor: "#2563eb", color: "#fff", "&:hover": { bgcolor: "#1d4ed8" }, "&:disabled": { bgcolor: "#cbd5e1" } }}
                      >
                        <Send />
                      </IconButton>
                    </Stack>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}
