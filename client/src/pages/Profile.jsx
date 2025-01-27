import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Tabs,
  Tab,
  Paper,
  ImageList,
  ImageListItem,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import PostCard from "../components/Home/PostCard";
import useProfile from "../hooks/useProfile";
import useUser from "../hooks/useUser";

function Profile() {
  const user = useSelector((state) => state?.app?.auth?.user);

  const {
    fetchUserData,
    fetchUserPosts,
    fetchImageArray,
    fetchListOfFollowers,
    fetchListOfFollowing,
    userData,
    postData,
    imageArray,
    following,
    follower,
  } = useProfile();

  const { followUser, unFollowUser } = useUser();

  const [tabs, setTabs] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  // Update lists when `follower` or `following` data changes
  useEffect(() => {
    setFollowersList(follower?.data ?? []);
    setFollowingList(following?.data ?? []);
  }, [follower, following]);

  // Fetch user data when component mounts or user ID changes
  useEffect(() => {
    if (user?._id) {
      const fetchData = async () => {
        await fetchUserData(user._id);
        await fetchUserPosts(user._id);
        await fetchImageArray(user._id);
        await fetchListOfFollowers(user._id);
        await fetchListOfFollowing(user._id);
      };
      fetchData();
    }
  }, [user?._id]);

  const handleTabs = (event, newIndex) => {
    setTabs(newIndex);
  };

  const handleFollow = async (id) => {
    try {
      setFollowersList((prev) =>
        prev.map((item) =>
          item.userId === id ? { ...item, followers: [...item.followers, user._id] } : item
        )
      );
      setFollowingList((prev) =>
        prev.map((item) =>
          item.userId === id ? { ...item, followers: [...item.followers, user._id] } : item
        )
      );
      await followUser({ _id: id }, user._id);
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnFollow = async (id) => {
    try {
      setFollowersList((prev) =>
        prev.map((item) =>
          item.userId === id
            ? { ...item, followers: item.followers.filter((followerId) => followerId !== user._id) }
            : item
        )
      );
      setFollowingList((prev) =>
        prev.map((item) =>
          item.userId === id
            ? { ...item, followers: item.followers.filter((followerId) => followerId !== user._id) }
            : item
        )
      );
      await unFollowUser({ _id: id }, user._id);
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
      {/* Cover Section */}
      <Box
        sx={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${userData?.data?.coverPicture ?? ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Profile Header */}
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
              userData?.data?.profilePicture ??
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
              {`${userData?.data?.followers ?? 0} followers | ${
                userData?.data?.followings ?? 0
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

      {/* Tabs */}
      <Paper>
        <Tabs value={tabs} onChange={handleTabs}>
          <Tab label="Posts" />
          <Tab label="Following" />
          <Tab label="Followers" />
          <Tab label="Photos" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabs === 0 && (
        <Box>
          {postData?.data?.length > 0 ? (
            postData.data.map((data) => (
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
            ))
          ) : (
            <Typography>No posts available</Typography>
          )}
        </Box>
      )}

      {tabs === 1 && (
        <Grid container spacing={2}>
          {followingList?.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  padding: "8px 0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar alt={item.name} src={item?.profilePicture} />
                  <Typography variant="subtitle1">{item?.name}</Typography>
                </Box>
                {item?.followers?.includes(user?._id) ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUnFollow(item?.userId)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleFollow(item?.userId)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                    }}
                  >
                    Follow
                  </Button>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {tabs === 2 && (
        <Grid container spacing={2}>
          {followersList?.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  padding: "8px 0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar alt={item.name} src={item?.profilePicture} />
                  <Typography variant="subtitle1">{item?.name}</Typography>
                </Box>
                {item?.followers?.includes(user?._id) ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUnFollow(item?._id)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleFollow(item?._id)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                    }}
                  >
                    Follow
                  </Button>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {tabs === 3 && (
        <ImageList cols={3} gap={16} style={{ margin: "20px" }}>
          {imageArray?.data?.map((image, index) => (
            <ImageListItem key={index}>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                loading="lazy"
                style={{ borderRadius: "8px" }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}

export default Profile;
