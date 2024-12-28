import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Comment from "./Comment"; // Import the Comment component

function PostCard({
  data,
  likeOrDislikePost,
  user,
  addComment,
  deleteComment,
  getTimeline,
  likeComment,
  editComment,
  getPostLikes,
  postLikes,
  savePost,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [open, setOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  const handleNext = () => {
    if (data?.images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.images.length);
    }
  };

  const handlePrev = () => {
    if (data?.images?.length) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + data.images.length) % data.images.length
      );
    }
  };

  const handleLikeToggle = async () => {
    try {
      await likeOrDislikePost(data?._id, user?._id);
      await getTimeline(user?._id);
    } catch (err) {
      console.error("Failed to like/dislike the post", err);
    }
  };

  const handleLikeCount = () => {
    getPostLikes(data?._id);
    setOpen(true);
  };

  const handlePostSave = async () => {
    try {
      await savePost(data?._id, user?._id);
      await getTimeline(user?._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle comment section visibility
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  return (
    <Card
      sx={{
        borderRadius: 2,
        width: "550px",
        maxWidth: "600px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        margin: "8px auto",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={data?.avatar} alt={data?.name} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {data?.name}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                • {moment(data?.createdAt).format("DD-MM-YYYY-HH:mm")}
              </Typography>
              {data?.location && (
                <Tooltip
                  title={data?.location.length > 30 ? data?.location : ""}
                  arrow
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ ml: 1 }}
                  >
                    At&nbsp;
                    {data?.location.length > 30
                      ? `${data?.location.substring(0, 30)}...`
                      : data?.location}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      {/* Divider */}
      <Divider />

      {/* Content */}
      <CardContent>
        <Typography variant="body1" mb={2}>
          {data?.desc}
        </Typography>
        {data?.images?.length > 0 && (
          <Box position="relative">
            <Box
              component="img"
              src={data.images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              sx={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {currentImageIndex > 0 && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}
            {currentImageIndex < data?.images?.length - 1 && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </Box>
        )}
        <Popover
          open={isMenuOpen}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          disableScrollLock
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: "8px",
              overflow: "visible",
              "&::before": {
                content: '""',
                display: "block",
                width: 0,
                height: 0,
                borderStyle: "solid",
                borderWidth: "0 8px 8px 8px",
                borderColor: "transparent transparent white transparent",
                position: "absolute",
                top: -8,
                left: "calc(50% - 8px)",
              },
            },
          }}
        >
          <Box>
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Edit</MenuItem>
          </Box>
        </Popover>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Box display="flex" alignItems="center">
          {data?.likes?.includes(user?._id) ? (
            <FavoriteIcon
              color="error"
              sx={{ cursor: "pointer" }}
              onClick={handleLikeToggle}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ cursor: "pointer", color: "text.secondary" }}
              onClick={handleLikeToggle}
            />
          )}
          <Typography
            variant="body2"
            ml={1}
            onClick={handleLikeCount}
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
              mr: 1,
              color: "text.secondary",
            }}
          >
            {data?.likes?.length || 0}
          </Typography>
          <IconButton onClick={toggleComments}>
            <ChatBubbleOutlineIcon />
            <Typography variant="body2" ml={1}>
              {data?.comments?.length || 0}
            </Typography>
          </IconButton>
          <IconButton onClick={handlePostSave}>
            <>{console.log(user)}</>
            {user?.saves?.includes(data?._id) ? (
              <BookmarkIcon />
            ) : (
              <BookmarkBorderIcon />
            )}
            <Typography variant="body2" ml={1}>
              {data?.saves || 0}
            </Typography>
          </IconButton>
        </Box>
      </CardActions>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DialogContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Likes
          </Typography>
          {postLikes?.length > 0 ? (
            postLikes.map((item) => (
              <Box
                display="flex"
                key={item?.userId}
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={item?.profile_pic} alt={item?.name} />
                  <Typography variant="subtitle2">{item?.name}</Typography>
                </Box>
                {!item?.is_following ? (
                  <Button
                    variant="contained"
                    disableElevation
                    disableRipple
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Follow
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    disableElevation
                    disableRipple
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Following
                  </Button>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No likes yet.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Divider />

      {/* Toggle Comments */}
      {showComments && (
        <Comment
          comments={data?.comments}
          addComment={addComment}
          deleteComment={deleteComment}
          likeOrDislikePost={likeOrDislikePost}
          postId={data?._id}
          data={data}
          userId={user?._id}
          getTimeline={getTimeline}
          likeComment={likeComment}
          editComment={editComment}
        />
      )}
    </Card>
  );
}

export default PostCard;
