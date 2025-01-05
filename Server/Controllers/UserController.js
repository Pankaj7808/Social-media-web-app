import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// get All users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();

    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a user
export const getUser = async (req, res) => {
  const id = req.params.id; //fdgfhgjhkjjhgfdfghj
  try {
    const user = await UserModel.findById(id); //undefined - {password: "123456", email: "abc@gmail", _id: "fdgfhgjhkjj}

    if (user) {
      //
      const { password, ...otherDetails } = user; //
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("Please, Try again it is invaild user!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Update a user

export const updateUser = async (req, res) => {
  const id = req.params.id;

  const { _id, password } = req.body;

  if (id === _id) {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      let pass = password.toString();
      req.body.password = await bcrypt.hash(pass, salt);
    }

    try {
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_KEY
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only update your own profile");
  }
};

// Delete a User

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { _id, currentUserAdminStatus } = req.body;

  if (_id === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only update your own profile");
  }
};

// Follow a User

export const followUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });

        res.status(200).json("User Followed!");
      } else {
        res.status(403).json("User is Already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UnFollow a User

export const UnFollowUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });

        res.status(200).json("User Unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export const setSearch = async (req, res) => {
  const id = req.params.id;
  const { searches } = req.body;
  console.log(id);
  console.log(searches);
  console.log(req.body);
  if (!searches) {
    return res.status(400).json({ error: "search not found" });
  }
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json("user not found");
    }
    user.searches.push(...searches);
    user.save();
    res.status(200).json({
      message: "search added successfully",
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSearch = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    console.log(user);
    if (!user) {
      res.status(400).json("user not found");
    }
    const data = user.searches.map((search) => {
      const searchObj =
        typeof search === "string" ? JSON.parse(search) : search;
      return {
        id: searchObj.id,
        name: searchObj.name,
        profilePicture: searchObj.profilePicture,
      };
    });
    res.status(200).json(data); 
  } catch (error) {
    res.status(400).json(error);
  }
};
