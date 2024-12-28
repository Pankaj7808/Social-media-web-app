import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  InputAdornment,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";

function Comment({
  addComment,
  deleteComment,
  comments,
  postId,
  userId,
  getTimeline,
  likeComment,
  editComment,
}) {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editableCommentId, setEditableCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleEditCommentTextChange = (e) => {
    setEditCommentText(e.target.value);
  };

  const handleEmojiClick = (emoji) => {
    setCommentText((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(postId, commentId, userId);
      await getTimeline(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (commentId) => {
    await editComment(postId, commentId, userId, editCommentText);
    await getTimeline(userId);
  };

  const handleEdit = async (commentId, text) => {
    if (commentId === editableCommentId) {
      if (
        editCommentText.trim().length > 0 &&
        editCommentText.trim().length > 0 &&
        editCommentText !== text
      ) {
        await handleEditComment(commentId);
      }
      setEditCommentText("");
      setEditableCommentId(null);
    } else {
      setEditCommentText(text);
      setEditableCommentId(commentId);
    }
  };

  const handleDelete = async(commentId)=>{
    await deleteComment(postId, commentId, userId);
    await getTimeline(userId)
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addComment(postId, userId, commentText);
      await getTimeline(userId);
      setCommentText("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        maxHeight: "200px",
        overflowY: "scroll",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        sx={{ my: 2, position: "relative" }}
        display="flex"
        gap={1}
        px={2}
        alignItems="center"
      >
        <TextField
          label="Write a comment"
          variant="outlined"
          fullWidth
          value={commentText}
          onChange={handleCommentChange}
          InputProps={{
            endAdornment: (
              <InputAdornment
                ref={emojiButtonRef}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                sx={{ cursor: "pointer" }}
                position="end"
              >
                <EmojiEmotionsIcon />
              </InputAdornment>
            ),
          }}
        />
        {showEmojiPicker && (
          <Box
            sx={{
              position: "absolute",
              right: "0",
              top: "60px",
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <EmojiPicker ref={emojiPickerRef} onEmojiClick={handleEmojiClick} />
          </Box>
        )}
        <Button
          variant="contained"
          disableElevation
          disableRipple
          onClick={handleSubmit}
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            boxShadow: "none",
            padding: "8px",
          }}
        >
          {loading ? <CircularProgress color="#fff" size={20} /> : "Post"}
        </Button>
      </Box>

      <Box px={3} my={2}>
        {comments?.length > 0 ? (
          comments?.map((comment) => (
            <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={comment?.name} alt={comment?.name} />
                <Box>
                  <Box display="flex" gap={1} alignItems="flex-end">
                    <Typography variant="subtitle2">{comment?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <small>
                        {moment(comment?.createdAt).format("DD-MM-YYYY-HH:MM")}
                      </small>
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      |
                    </Typography>

                    {userId === comment?.userId && (
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          handleEdit(comment?.commentId, comment?.text);
                        }}
                      >
                        <small>
                          {editableCommentId === comment?.commentId &&
                          editCommentText.trim().length > 0 &&
                          editCommentText !== comment?.text
                            ? "Save"
                            : editableCommentId === comment?.commentId
                            ? "Cancel"
                            : "Edit"}
                        </small>
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color="primary"
                      onClick={()=>handleDelete(comment?.commentId)}
                      sx={{ cursor: "pointer" }}
                    >
                      <small>Delete</small>
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {editableCommentId !== comment?.commentId ? (
                      <Typography variant="body2" color="text.secondary">
                        {comment?.text}
                      </Typography>
                    ) : (
                      <TextField
                        size="small"
                        value={editCommentText}
                        onChange={handleEditCommentTextChange}
                        variant="standard"
                        autoFocus
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                alignSelf="flex-end"
              >
                {comment?.likes?.includes(userId) ? (
                  <FavoriteIcon
                    onClick={() => {
                      handleLikeComment(comment?.commentId);
                    }}
                    color="error"
                    sx={{ fontSize: 13, cursor: "pointer" }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={() => {
                      handleLikeComment(comment?.commentId);
                    }}
                    sx={{ fontSize: 13, cursor: "pointer" }}
                  />
                )}
                <Typography variant="body2" color="text.secondary">
                  <small>{comment?.likes?.length || 0}</small>
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            textAlign="center"
            color="text.secondary"
            variant="subtitle1"
            sx={{ fontWeight: "bold", textDecoration: "upper" }}
          >
            No comments yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Comment;
