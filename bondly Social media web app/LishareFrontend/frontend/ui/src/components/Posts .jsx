import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api";

const API_BASE = "http://localhost:4041";

export default function Posts() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareCaption, setShareCaption] = useState({});

  const fetchFeed = useCallback(async () => {
    try {
      const res = await api.get("/shares/feed");
      setFeed(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleCreatePost = async () => {
    if (!content.trim() && !image) {
      alert("Post must have content or image");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setContent("");
      setImage(null);
      await fetchFeed();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  const handleShare = async (postId) => {
    try {
      const caption = shareCaption[postId] || "";
      await api.post(`/shares/${postId}/share`, { caption });
      setShareCaption((prev) => ({ ...prev, [postId]: "" }));
      await fetchFeed();
    } catch (err) {
      console.error(err);
      alert("Failed to share post");
    }
  };

  const handleDeleteShare = async (shareId) => {
    if (!window.confirm("Are you sure you want to delete this share?")) return;
    try {
      await api.delete(`/shares/${shareId}`);
      await fetchFeed();
    } catch (err) {
      console.error(err);
      alert("Failed to delete share");
    }
  };

  const renderImage = (url) =>
    url && (
      <Box
        component="img"
        src={`${API_BASE}${url}`}
        alt="post"
        sx={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 1 }}
      />
    );

  if (loading) return <Typography sx={{ p: 3 }}>Loading feed...</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: 3 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          <Typography variant="h5" sx={{ mb: 1.5 }}>Create Post</Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 1.5 }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="outlined" component="label">
              Add Image
              <input hidden type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </Button>
            <Button variant="contained" onClick={handleCreatePost}>Post</Button>
          </Stack>
        </Paper>

        <Typography variant="h5" sx={{ mb: 1.5 }}>Feed</Typography>
        {feed.length === 0 && <Typography color="text.secondary">No posts yet</Typography>}

        <Stack spacing={2}>
          {feed.map((item) => (
            <Paper key={`${item.type}-${item.postId}`} sx={{ p: 2, borderRadius: 1 }}>
              {item.type === "POST" && (
                <Stack spacing={1.5}>
                  <Typography variant="h6">{item.authorName}</Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>{item.content}</Typography>
                  {renderImage(item.imageUrl)}
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                      placeholder="Add caption..."
                      value={shareCaption[item.postId] || ""}
                      onChange={(e) =>
                        setShareCaption((prev) => ({ ...prev, [item.postId]: e.target.value }))
                      }
                      fullWidth
                    />
                    <Button variant="contained" onClick={() => handleShare(item.postId)}>Share</Button>
                  </Stack>
                </Stack>
              )}

              {item.type === "SHARE" && (
                <Stack spacing={1.5}>
                  <Typography>
                    <strong>{item.sharedByName}</strong> shared this post
                  </Typography>
                  {item.shareCaption && (
                    <Typography>
                      <strong>Caption:</strong> {item.shareCaption}
                    </Typography>
                  )}
                  <Box sx={{ border: "1px solid #dde5f0", borderRadius: 1, p: 1.5, bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle1">{item.authorName}</Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{item.content}</Typography>
                    {renderImage(item.imageUrl)}
                  </Box>
                  <Button color="error" variant="outlined" onClick={() => handleDeleteShare(item.postId)}>
                    Delete Share
                  </Button>
                </Stack>
              )}
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
