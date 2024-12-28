import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

function usePost() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [error, setError] = useState(null);

  const createPost = async (body) => {
    setLoading(true);
    try {
      const res = await axios.post("/post", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      enqueueSnackbar(res?.data?.message || "Posted Successfully", {
        variant: "success",
      });
      return res;
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err?.response?.data?.message || "Post Failed", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeline = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/post/${userId}/timeline`);
      setTimelineData(res?.data || []);
      enqueueSnackbar("Timeline fetched successfully", {
        variant: "success",
      });
      return res?.data;
    } catch (err) {
      console.error(err);
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch timeline",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const likeOrDislikePost = async (postId, userId) => {
    setLoading(true);
    try {
      const res = await axios.put(`/post/${postId}/like_dislike`, {
        userId: userId,
      });
      enqueueSnackbar(res?.data?.message || "Action successful", {
        variant: "success",
      });
      return res;
    } catch (err) {
      console.error(err);
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to update post action",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId, userId, commentText) => {
    setLoading(true);
    try {
      await axios.post(`/post/${postId}/comments`, {
        userId,
        commentText,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to add comment");
      setLoading(false);
    }
  };

  const likeComment = async (postId, commentId, userId) => {
    setLoading(false);
    try {
      await axios.patch(`post/${postId}/comment/${commentId}/like`, {
        userId,
      });
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to update post action",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const editComment = async (postId, commentId, editorId, text) => {
    setLoading(false);
    try {
      await axios.patch(`post/${postId}/comment/${commentId}/edit`, {
        editorId,
        text,
      });
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to update post action",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (postId, commentId, userId) => {
    setLoading(true);
    try {
      await axios.delete(`/post/${postId}/comments`, {
        data: { userId, commentId },
      });
    } catch (err) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to update post action",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getPostLikes = async (postId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/post/${postId}/like`);
      console.log(res);
      setPostLikes(res?.data?.data);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch likes",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (postId, userId) => {
    try {
      await axios.patch(`post/${postId}/save`, { userId });
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch likes",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createPost,
    getTimeline,
    timelineData,
    likeOrDislikePost,
    addComment,
    deleteComment,
    likeComment,
    editComment,
    getPostLikes,
    postLikes,
    savePost,
  };
}

export default usePost;
