import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  like_dislike_Post,
  timeline,
  updatePost,
  addComment,
  deleteComment,
  likeComment,
  editComment,
  getPostLikes,
  savePost,
} from "../Controllers/PostController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like_dislike", like_dislike_Post);
router.get("/:id/timeline", timeline);
router.post("/:id/comments", addComment);
router.delete("/:id/comments", deleteComment);
router.get("/:postId/like", getPostLikes);
router.patch("/:postId/comment/:commentId/like", likeComment);
router.patch("/:postId/comment/:commentId/edit", editComment);
router.patch("/:postId/save", savePost);

export default router;
