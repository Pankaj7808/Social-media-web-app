import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import useProfile from "../hooks/useProfile";
import { useSelector } from "react-redux";
import PostCard from "../components/Home/PostCard";
import Grid from "@mui/material/Grid2";

function Profile() {
  const user = useSelector((state) => state?.app?.auth?.user);
  const {
    fetchUserData,
    fetchUserPosts,
    fetchImageArray,
    fetchListOfFollowers,
    fetchListOfFollowing,
    followAUser,
    unfollowAUser,
    loading,
    userData,
    postData,
    following,
    follower,
  } = useProfile();

  const [tabs, setTabs] = useState(0);

  useEffect(() => {
    if (user?._id) {
      fetchUserData(user._id);
      fetchUserPosts(user._id);
      fetchImageArray(user._id);
      fetchListOfFollowers(user._id);
      fetchListOfFollowing(user._id);
     
    }
  }, [user?._id]); // Ensure data is fetched only when user._id is defined

  const handleTabs = (event, newIndex) => {
    //haa pehele unfolow wla krtiu bd m image k dekhte h where?
    setTabs(newIndex);
  };

  const handleFollow = (id) => {
    if (user?._id) followAUser(user._id, id);
  };

  const handleUnFollow = (id) => {
    if (user?._id) unfollowAUser(user._id, id);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
      {/* Cover Photo */}
      <Box
        sx={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${userData?.data?.coverPicture || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={
              userData?.data?.profilePicture ||
              "https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg"
            }
            alt="Profile"
            sx={{ width: 120, height: 120, marginRight: "20px" }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {userData?.data?.name || "Anonymous User"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`${userData?.data?.followers || 0} followers | ${
                userData?.data?.followings || 0
              } following`}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button variant="contained" sx={{ margin: "0 5px" }}>
            Add Friend
          </Button>
          <Button variant="outlined" sx={{ margin: "0 5px" }}>
            Edit Profile
          </Button>
          <Button variant="text" sx={{ margin: "0 5px" }}>
            More Options
          </Button>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Paper>
        <Tabs value={tabs} onChange={handleTabs}>
          <Tab label="Posts" />
          <Tab label="Following" />
          <Tab label="Followers" />
        </Tabs>
      </Paper>

      {/* Content Based on Tabs */}

      {tabs === 0 && (
        <Box>
          {postData?.data?.length > 0 ? (
            postData.data.map((data) => (
              <div>
                <PostCard
                  key={data._id}
                  userId={data.userId}
                  name={data.name}
                  desc={data.desc}
                  likes={data.likes}
                  images={data.images}
                  location={data.location}
                  comments={data.comments}
                />
                <>{console.log(data.images)}</>
              </div>
            ))
          ) : (
            <Typography>No posts available</Typography>
          )}
        </Box>
      )}
      <Box>
        {tabs == 1 && (
          <Grid container spacing={2}>
            {following?.data?.map((item, index) => (
              <Grid item size={{ xs: 3 }} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // gap: 2,//ek sec
                    padding: "8px 0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar alt={item.name} src={item?.profilePicture} />
                    <Typography variant="subtitle1">{item.name}</Typography>
                  </Box>
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
                    onClick={() => handleUnFollow(item.userId)}
                  >
                    Unfollow
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Box>
        {tabs == 2 && (
          <Grid container spacing={2}>
            {follower?.data?.map(
              (
                item,
                index //pnkj,tayba,huda
              ) => (
                <Grid item size={{ xs: 3 }} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // gap: 2,//ek sec
                      padding: "8px 0",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar alt={item.name} src={item?.profilePicture} />
                      <Typography variant="subtitle1">{item.name}</Typography>
                    </Box>
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
                      onClick={() => handleFollow(item.userId)}
                    >
                      Follow
                    </Button>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default Profile;
