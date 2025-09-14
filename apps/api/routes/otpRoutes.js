import express from 'express';
const otpRoutes = express.Router();
import { generateOTP } from '../controllers/otpController.js';

otpRoutes.post('/getOtp', generateOTP)

export default otpRoutes;