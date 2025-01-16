import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  ImageListItem,
  ImageList,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import useProfile from "../hooks/useProfile";

import { useSelector } from "react-redux";
import PostCard from "../components/Home/PostCard";

function Profile() {
  const user = useSelector((state) => state?.app?.auth?.user);
  const {
    fetchUserData,
    fetchUserPosts,
    loading,
    userData,
    postData,
    Error,
    fetchImageArray,
    imageArray,
    fetchListOfFollowers,
    follower
  } = useProfile();

  useEffect(() => {
    fetchUserData(user?._id);
    fetchUserPosts(user?._id);
    fetchImageArray(user?._id);
    fetchListOfFollowers(user?._id)
  }, []);
  //}, [fetchUserPosts, fetchUserData, fetchImageArray]);

  console.log(userData?.data);
  console.log("user", user);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
      {/* Cover Photo */}
      <Box
        sx={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${userData?.data.cover_picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Box>

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
        {/* Left Section: Profile Picture and Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={
              userData?.data.profile_pic ||
              "https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt="Profile Picture"
            sx={{ width: 120, height: 120, marginRight: "20px" }}
          />

          <Box>
            <Typography variant="h4" fontWeight="bold">
              {userData?.data?.name || "Pankaj Mandal"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userData
                ? `${userData?.data.follower_count} followers | ${userData?.data.followings_count} following`
                : "416 followers | 575 following"}
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Buttons */}
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
      {/* <Box> */}
        {/* <>{console.log(postData)}</>
        {postData?.data?.map((data) => {
          return (
            <PostCard
              user={user}
              // addComment={addComment}
              // deleteComment={deleteComment}
              // likeOrDislikePost={likeOrDislikePost}
              key={data?._id}
              data={data}
              // getTimeline={getTimeline}
              // likeComment={likeComment}
              // editComment={editComment}
              // getPostLikes={getPostLikes}
              // postLikes={postLikes}
              // savePost={savePost}
            />
          );
        })}
      </Box> */}
      <>{fetchListOfFollowers}</>
      <Card>
        <CardHeader title="All Photos" />
        <CardContent>
          <ImageList
            sx={{ width: "100%", maxWidth: 900, height: 850 }}
            cols={3}
            rowHeight={164}
          >
            {imageArray?.data?.map((url, index) => (
              <ImageListItem key={index}>
                <img
                  src={`${url}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt="User Uploaded"
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Profile;
