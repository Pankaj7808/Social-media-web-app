import express from 'express';
import { generateOtp, loginUser, registerUser, verifyOtp } from '../Controllers/AuthController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/get-otp', generateOtp);
router.post('/verify-otp', verifyOtp)

export default router;


