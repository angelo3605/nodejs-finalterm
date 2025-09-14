import { createAndSendOTPService } from "../services/otpService.js";

export const generateOTP = async (req, res) => {
    try {
        const { transactionId, email } = req.body;

        if (!transactionId || !email) {
            return res.status(400).json({ message: 'Transaction ID and email are required' });
        }

        const otpResult = await createAndSendOTPService(transactionId, email);
        return res.status(200).json(otpResult);
    } catch (error) {
        return res.status(401).json({ message: error.message || 'OTP cannot be generated!' });
    }
};
