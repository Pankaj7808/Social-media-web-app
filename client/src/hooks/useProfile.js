import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

function useProfile() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [Error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [follower,setFollower] = useState(null)

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}`);
      setUserData(res.data); // Save the data
      //console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/profile/${userId}/posts`);
      setPostData(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load posts...");
    } finally {
      setLoading(false);
    }
  };

  const fetchImageArray = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/profile/${userId}/images`);
      setImageArray(res.data);
      enqueueSnackbar(res?.data?.message || "Images fetched successfully", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Couldn't fetch image", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
 
  const fetchListOfFollowers = async(userId) =>{
    setLoading(true)
    try{
      const res = await axios.get(`/profile/${userId}/followers`)
      setFollower(res.data)
      enqueueSnackbar(res?.data?.message || "Followers fetched successfully" , {variant:"success"})
    }catch(err){
      enqueueSnackbar(err.response?.data?.message || "Couldn't fetched followers" ,{variant:"error"})

    }finally{
      setLoading(false)
    }
  }
  return {
    fetchUserData,
    loading,
    userData,
    postData,
    Error,
    fetchUserPosts,
    fetchImageArray,
    imageArray,
    fetchListOfFollowers,
    follower,
  };
}

export default useProfile;
