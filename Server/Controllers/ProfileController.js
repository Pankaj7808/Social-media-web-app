import UserModel from "../Models/userModel.js";
import postModel from "../Models/postModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id); //
    if (!user) {
      res.status(404).json("User not found");
    } else {
      const data = {
        profile_pic: user.profilePicture,
        cover_picture: user.coverPicture,
        follower_count: user.followers.length,
        followings_count: user.following.length,
        name: user.name,
      };
      res.status(200).json({ data });
    }
  } catch (err) {
    res.status(404).json("error");
  }
};

export const getImagesArr = async (req, res) => {
  const userId = req.params.id; // Extract userId from request parameters
  try {
    // Fetch posts for the given userId
    const posts = await postModel.find({ userId });

    // Map to extract images from each post and flatten the array
    const images = posts.map((post) => post.images).flat(Infinity); // Flattening nested arrays of images

    // Return the flattened array of images
    res.status(200).json({ data: images });
  } catch (error) {
    // Handle errors and send an appropriate response
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}; 

export const getPost = async (req, res) => {
  try {
    const post = await postModel.find({ userId: req.params.id });

    if (!post) {
      return res.status(404).json("Post not found"); //
    }

    return res.status(200).json({
      data: post.sort((a, b) => {
        return b.createdAt - a.createdAt;
      }),
    });
  } catch (error) {
    console.error(error); //
    res.status(500).json("An error occurred");
  }
};

export const listOfFollowers = async (req, res) => {
  console.log( req.params.id, "I'd is recieving")
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
      const filteredFollowers = followersdata.filter(
        (follower) => follower !== null
      );
  
      res.status(200).json({ data: filteredFollowers });
    } catch (err) {
      console.error("Error occurred: ", err);
      res
        .status(500)
        .json({ message: "An error occurred while fetching followers" });
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
    res
      .status(500)
      .json({ message: "An error occurred while fetching following" });
  }
};
