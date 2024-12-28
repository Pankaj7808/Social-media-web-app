import { Box } from "@mui/material";
import React, { useEffect } from "react";
import PostInput from "../components/Home/CreatePost";
import usePost from "../hooks/usePost";
import PostCard from "../components/Home/PostCard";

function Home({ user }) {
  const {
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
    savePost
  } = usePost();
  useEffect(() => {
    getTimeline(user?._id);
  }, [user?._id]);
  return (
    <Box display="flex" flexDirection="column">
      <PostInput
        getTimeline={getTimeline}
        user={user}
        createPost={createPost}
      />

      {timelineData?.map((data) => {
        return (
          <PostCard
            user={user}
            addComment={addComment}
            deleteComment={deleteComment}
            likeOrDislikePost={likeOrDislikePost}
            key={data?._id}
            data={data}
            getTimeline={getTimeline}
            likeComment={likeComment}
            editComment={editComment}
            getPostLikes={getPostLikes}
            postLikes={postLikes}
            savePost={savePost}
          />
        );
      })}
    </Box>
  );
}

export default Home;
