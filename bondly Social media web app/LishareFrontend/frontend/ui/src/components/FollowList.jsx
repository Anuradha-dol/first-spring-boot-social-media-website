import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../followApi";

const UserRow = ({ user, action }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
    <Typography>{user.firstName} {user.lastName}</Typography>
    {action}
  </Stack>
);

const FollowList = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const followersData = await getFollowers();
      const followingData = await getFollowing();
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (err) {
      setError("Failed to load follow data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Follow action failed");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Unfollow action failed");
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error) return <Typography sx={{ p: 3 }} color="error">{error}</Typography>;

  return (
    <Box sx={{ bgcolor: "#f5f7fb", p: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper sx={{ flex: 1, p: 2, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>Followers</Typography>
          {followers.length === 0 && <Typography color="text.secondary">No followers yet</Typography>}
          <Stack spacing={1}>
            {followers.map((user) => (
              <UserRow
                key={user.userId}
                user={user}
                action={!following.some((f) => f.userId === user.userId) && (
                  <Button size="small" variant="contained" onClick={() => handleFollow(user.userId)}>
                    Follow
                  </Button>
                )}
              />
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>Following</Typography>
          {following.length === 0 && <Typography color="text.secondary">Not following anyone</Typography>}
          <Stack spacing={1}>
            {following.map((user) => (
              <UserRow
                key={user.userId}
                user={user}
                action={(
                  <Button size="small" variant="outlined" color="error" onClick={() => handleUnfollow(user.userId)}>
                    Unfollow
                  </Button>
                )}
              />
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default FollowList;
