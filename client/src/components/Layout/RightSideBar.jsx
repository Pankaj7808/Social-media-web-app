import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import useUser from "../../hooks/useUser";

export default function RightSideBar({ users, user }) {
  const { followUser } = useUser();

  const [allUsers, setAllUsers] = useState([]);

  const handleFollow = (id) => {
    setAllUsers((prevAllUsers) =>
      prevAllUsers.map((user) =>
        user._id === id
          ? { ...user, followers: [...user.followers, user._id] }
          : user
      )
    );

    const data = { _id: id };
    followUser(data, user._id);
  };

  useEffect(()=>{
    setAllUsers(users);
  },[users])

  return (
    <Box
      sx={{
        width: 240,
        padding: 2,
        top: "73px",
        right: "0",
        height: "calc(100vh - 106px)",
        backgroundColor: "#fff",
        overflowY: "scroll",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        Suggestions
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {allUsers.map((user, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              padding: "8px 0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar alt={user.name} src={user?.profilePicture} />
              <Typography variant="subtitle1">{user.name}</Typography>
            </Box>
            {user?.followers?.includes(user?._id) ? (
              <Button
                variant="outlined"
                size="small"
                disableElevation
                disableRipple
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  boxShadow: "none",
                }}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                disableElevation
                disableRipple
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  boxShadow: "none",
                }}
                onClick={() => handleFollow(user?._id)}
              >
                Follow
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}