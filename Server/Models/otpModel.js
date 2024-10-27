import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 300 } // 5 minutes expiry
});

const otpModel = mongoose.model('Otp', otpSchema);

export default otpModel;