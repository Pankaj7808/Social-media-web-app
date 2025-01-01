import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpModel from "../Models/otpModel.js";

// Store OTP in the database
const storeOtp = async (email, otp) => {
  const newOtp = new otpModel({ email, otp });
  await newOtp.save();
  console.log('wwww')
};

// Generate OTP and send it via email

export const generateOtp = async (req, res) => {
  const { email, old_user } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  const oldUser = await UserModel.findOne({ email });
  if(old_user){
   if(!oldUser){
    return res.status(400).json({message:"User not found."})
   }
  }else{
    if (oldUser){
      return res.status(400).json({message: "Email already exists."})
    }
  }

  // Generate a 6-digit OTP
  const otp = Math.trunc(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  try {
    await storeOtp(email, otp);

    // Send OTP via email
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

// Verify OTP function
const signup = async (email, otp) => {
  const storedOtp = await otpModel.findOne({ email }).sort({ createdAt: -1 });
  if (!storedOtp) {
    return false;
  }
  return storedOtp.otp === otp;
};

// Register new users
export const registerUser = async (req, res) => {
  const { email, password, otp, ...userInfo } = req.body;

  try {
    const isOtpValid = await signup(email, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const userData = { ...userInfo, email, password: hashedPass };

    const newUser = new UserModel(userData);
    await newUser.save();

      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_KEY
      );
      console.log(token)
    res.status(201).json({user:newUser});
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
          .json({ message: "Please enter the correct email or password" });
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
        .json({ message: "Please enter the correct email or password!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(otp)
  try {
    const storedOtp = await otpModel
      .findOne({ email: email })
      .sort({ createdAt: -1 });
    console.log(storedOtp)
    if (!storedOtp?.otp || storedOtp?.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
    } else {
      res.status(200).json({ message: "OTP verify successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//export 

// const a = (req,res)=>{
//   co
  // }
// 
  // function a (req,res){
  // }