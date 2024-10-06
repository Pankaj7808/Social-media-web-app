import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { createClient } from "redis";

const client = createClient({
    password: 'Aqt5RNYsI0adF1udUPUArOEFXnHeMvME',
    socket: {
        host: 'redis-13072.c15.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 13072
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

export const generateOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate a 6-digit OTP
  const otp = Math.trunc(Math.random() * 1000000)
    .toString()
    .padStart(6, "0"); // Ensure OTP is 6 digits

  try {
    await client.set("email", otp);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mpankajmandall@gmail.com",
        pass: "angl cjaz ixzr pssz",
      },
    });

    await transporter.sendMail({
      from: '"Pankaj Mandal" <mpankajmandall@gmail.com>',
      to: email,
      subject: "OTP from Connectly",
      html: `<h4>Welcome to Connectly</h4><p>Your OTP is ${otp}</p>`,
    });

    res.status(200).json({ message: "OTP has been sent successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
};

export const verifyOtp = async (req, res) => {
  console.log("err")
};

// register new users
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  let pass = password.toString();
  const hashedPass = await bcrypt.hash(pass, parseInt(salt));
  req.body.password = hashedPass;

  const newUser = new UserModel(req.body);

  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "This User already exists!" });
    }

    const user = await newUser.save();

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_KEY
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login users

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res
          .status(400)
          .json("Soory, Please enter the correct email or password!");
      } else {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_KEY
        );
        res.status(200).json({ user, token });
      }
    } else {
      res
        .status(404)
        .json("Soory, Please enter the correct email or password!");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
