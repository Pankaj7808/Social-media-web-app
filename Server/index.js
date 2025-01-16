import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import ProfileRoute from "./Routes/ProfileRoute.js";

// Load environment variables
dotenv.config();

const app = express();

// Serve images for public (public folder)
app.use(express.static("public"));
app.use("/images", express.static("images"));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// Start server only if DB connection is successful
connectDB().then(() =>
  app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
  )
);

// Test route
app.get("/test", (req, res) => {
  console.log("This is logged to the server console.");
  res.send("Check the server console for the log.");
});

// Route usage
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/profile", ProfileRoute);

console.log("hi");
