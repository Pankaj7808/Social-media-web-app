import postModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import { uploadToImgur } from "../utils/upload.js";
import { store } from "../utils/storage.js";
import { ObjectId } from "mongodb";

export const createPost = async (req, res) => {
  store.array("images", 10)(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading files", error: err.message });
    }

    const { userId, desc, location } = req.body;

    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Upload images to Imgur
      const uploadImageUrls = await Promise.all(
        req.files.map((file) => uploadToImgur(file))
      );

      // Check for failed uploads
      const failedUploads = uploadImageUrls.filter((result) => !result.success);
      if (failedUploads.length > 0) {
        return res.status(500).json({
          message: "Some image uploads failed",
          errors: failedUploads,
        });
      }

      // Create new post
      const newPost = new postModel({
        name: user.name,
        userId,
        desc,
        location,
        images: uploadImageUrls.map((result) => result.url),
      });

      await newPost.save();
      res.status(200).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(500)
        .json({ message: "Failed to create post", error: error.message });
    }
  });
};

// get a post
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Update a Post
export const updatePost = async (req, res) => {
  const postId = req.params.id;

  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated Successfully!");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;

  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted Successfully!");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Like/Dislike a Post
export const like_dislike_Post = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { userId } = req.body;
  console.log(userId);
  try {
    const post = await postModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked.");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unliked.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline a Posts
export const timeline = async (req, res) => {
  const userId = req.params.id;

  try {
    const currenUserPosts = await postModel.find({ userId: userId });
    const followingUserPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingUserPosts",
        },
      },
      {
        $project: {
          followingUserPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currenUserPosts
        .concat(...followingUserPosts[0].followingUserPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//add comment in a post
export const addComment = async (req, res) => {
  const postId = req.params.id;
  const { userId, commentText } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const commentId = new ObjectId();

    const newComment = {
      commentId,
      userId,
      name: user.name,
      text: commentText,
      likes: [],
      createdAt: new Date(),
    };

    await post.updateOne({ $push: { comments: newComment } });

    res.status(200).json({ message: "Comment added successfully", newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

export const likeComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (item) => item.commentId.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
      await post.updateOne({ $set: { comments: post.comments } });
      return res
        .status(200)
        .json({ message: "Like removed successfully", comment });
    } else {
      comment.likes.push(userId);
      await post.updateOne({ $set: { comments: post.comments } });
      return res
        .status(200)
        .json({ message: "Comment liked successfully", comment });
    }
  } catch (error) {
    console.error("Error liking/unliking comment:", error);
    res
      .status(500)
      .json({ message: "Failed to like/unlike comment", error: error.message });
  }
};

export const editComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { editorId, text } = req.body;

  try {
    const post = await postModel.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = post.comments.find(
      (item) => item.commentId.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (comment.userId !== editorId) {
      return res.status(404).json({
        message: "Action forbidden: You can only edit your own comments",
      });
    }

    comment.text = text;

    await post.updateOne({ $set: { comments: post.comments } });

    res.status(200).json({
      message: "Comment edited successfully.",
      updatedComment: comment,
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    res
      .status(500)
      .json({ message: "Failed to edit comment.", error: error.message });
  }
};

// Delete Comment from Post
export const deleteComment = async (req, res) => {
  const { id: postId } = req.params;
  const { userId, commentId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (item) => item.commentId.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Action forbidden: You can only delete your own comments",
      });
    }

    // Remove the comment
    const updatedComments = post.comments.filter(
      (item) => item.commentId.toString() !== commentId
    );

    // Update the post with the modified comments array
    await post.updateOne({ $set: { comments: updatedComments } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message });
  }
};

export const getPostLikes = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await postModel.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const likes = post.likes;

    const response = await Promise.all(
      likes.map(async (item) => {
        const user = await UserModel.findOne({ _id: item });
        return {
          userId: user._id,
          name: user.name,
          profile_pic: user.profilePicture,
          is_following: user.following.includes(userId),
        };
      })
    );

    return res
      .status(200)
      .json({ data: response, message: "Post likes fetched successfully." });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return res.status(500).json({ message: "Error in fetching likes." });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

 
  try {
    const post = await postModel.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.saves.push(postId);

    await user.save();
    res.status(200).json({ message: "Post saved successfully." });
  } catch (error) {
    console.error("Error in saving : ", error);
    res.status(500).json({ message: "Post saving faied." });
  }
};

//getlikes
export const getLikes = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    console.log("Post found:", post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes || post.likes.length === 0) {
      return res.status(404).json({ message: "No likes found for this post" });
    }

    const likes = await Promise.all(
      post.likes.map(async (id) => {
        const user = await UserModel.findById(id); // Adjust UserModel path if necessary
        if (!user) return null;
        return {
          userId: user._id,
          name: user.name,
          profilePicture: user.profilePicture,
        };
      })
    );

    const validLikes = likes.filter((like) => like !== null);
    res.status(200).json({ data: validLikes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



