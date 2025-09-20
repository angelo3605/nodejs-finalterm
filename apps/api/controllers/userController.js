import {
    changePasswordService,
    sendPasswordResetOTPService,
    resetPasswordWithOTPService
} from "../services/userService.js";

export const changePassword = async (req, res) => {
    const userId = req.user.userId; // Lấy userId từ token đã giải mã trong middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
    }

    try {
        await changePasswordService(userId, currentPassword, newPassword);
        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        // Nếu service trả về lỗi dạng { status, message }, bạn có thể sửa lại bên service để throw lỗi chuẩn
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const sendPasswordResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        await sendPasswordResetOTPService(email);
        return res.json({ message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const resetPasswordWithOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    try {
        await resetPasswordWithOTPService(email, otp, newPassword);
        return res.json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const updateFullName = async (req, res) => {
    const userId = req.user.id;
    const { fullName } = req.body;

    try {
        const result = await updateUserFullNameService(userId, fullName);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const upsertShippingAddress = async (req, res) => {
    const userId = req.user.id;
    const { address, phoneNumber, isDefault } = req.body;

    try {
        const result = await upsertShippingAddressService(userId, { address, phoneNumber, isDefault });
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};