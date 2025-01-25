import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

function useProfile() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}`);
      setUserData(res.data);
    } catch (err) {
      enqueueSnackbar("Failed to fetch user data", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}/posts`);
      setPostData(res.data);
    } catch (err) {
      enqueueSnackbar("Failed to load posts", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImageArray = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}/images`);
      setImageArray(res.data);
      enqueueSnackbar("Images fetched successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Couldn't fetch images", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListOfFollowers = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}/followers`);
      setFollower(res.data);
      enqueueSnackbar("Followers fetched successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Couldn't fetch followers", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListOfFollowing = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}/following`);
      setFollowing(res.data);
      enqueueSnackbar("Followings fetched successfully", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Couldn't fetch followings", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const followAUser = async  (currentuserId,followuserid,) => {
    setLoading(true);
    console.log(followuserid)
    const data={_id:followuserid} //pass hmm hmm? ook
    try {
      const res = await axios.put(`/user/${currentuserId}/follow`,data);   
      
      enqueueSnackbar("Followed a user ", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Couldn't follow", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unfollowAUser = async  (currentuserId,followuserid,) => {
    setLoading(true);
    console.log(followuserid)
    const data={_id:followuserid} //pass hmm hmm? ook
    try {
      const res = await axios.put(`/user/${currentuserId}/unfollow`,data);   
      
      enqueueSnackbar("unfollowed a user ", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Couldn't unfollow", { variant: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
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
    imageArray,
    follower,
    following,
  };
}

export default useProfile;
