import UserModel from "../Models/userModel.js";
import postModel from '../Models/postModel.js'

 
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id); //
    if (!user) {
      res.status(404).json("User not found");
    } else {
      const data = {
        profile_pic: user.profilePicture,
        follower_count: user.followers.length,
        followings: user.following.length,
        name: user.name,
        cover_picture: user.coverPicture,
      };
      res.status(200).json({ data });
    }
  } catch (err) {
    res.status(404).json("error");
  }
};

export const getImagesArr = async (req, res) => {
  try {
    console.log("Fetching post with ID:", req.params.id);
    const post = await postModel.findById(req.params.id);

    if (!post) {
      console.log("Post not found for ID:", req.params.id);
      return res.status(404).json("Post not found");
    }

    console.log("Post retrieved:", post);

    const images = post.images || []; // Handle undefined images field

    if (images.length === 0) {
      return res.status(404).json("No images found");
    }

    const revimg = images.reverse();

    res.status(200).json(revimg);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json("An error occurred");
  }
};


export const getPost = async (req, res) => {
  try {
    const post = await postModel.find({userId:req.params.id}); 

    if (!post) {
      return res.status(404).json("Post not found"); // 
    }

    return res.status(200).json({ data: post }); 
  } catch (error) {
    console.error(error); // 
    res.status(500).json("An error occurred"); 
  }
};


export const listOfFollowers = async (req, res) => {
  try {
    const foll = await UserModel.findById(req.params.id);
    if (!foll || !foll.followers) {
      return res.status(404).json("User or followers not found");
    }

    const followersid = foll.followers;

    // Use Promise.all to wait for all async operations
    const followersdata = await Promise.all(
      followersid.map(async (follwr) => {
        const followerr = await UserModel.findById(follwr); // fetch each follower by their ID
        if (!followerr) {
          return null; // If no follower is found, return null (or handle accordingly)
        }
        const data = {
          userId: followerr._id,
          name: followerr.name,
          profilePicture: followerr.profilePicture,
        };
        return data;
      })
    );

    // Filter out any null values in case a follower was not found
    const filteredFollowers = followersdata.filter((follower) => follower !== null);

    res.status(200).json({ data: filteredFollowers });
  } catch (err) {
    console.error("Error occurred: ", err);
    res.status(500).json({ message: "An error occurred while fetching followers" });
  }
};

export const listOfFollowing = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user || !user.following) {
      return res.status(404).json("User or following not found");
    }

    // Fetch all users the given user is following in parallel using Promise.all
    const following = await Promise.all(
      user.following.map(async (followingId) => {
        const followingUser = await UserModel.findById(followingId);
        if (!followingUser) return null; // Ignore non-existent users
        return {
          userId: followingUser._id,
          name: followingUser.name,
          profilePicture: followingUser.profilePicture,
        };
      })
    );

    // Remove any null values from the results
    const validFollowing = following.filter((f) => f !== null);

    res.status(200).json({ data: validFollowing });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "An error occurred while fetching following" });
  }
};
