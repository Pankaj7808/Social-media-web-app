import express from 'express';
import { generateOtp, loginUser, registerUser, resetPassword, verifyOtp } from '../Controllers/AuthController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/get-otp', generateOtp);
router.post('/verify-otp', verifyOtp)
router.put('/reset-password', resetPassword)

export default router;


