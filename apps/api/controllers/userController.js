import { changePasswordService, sendNewPasswordService, updateUserFullNameService } from "../services/userService.js";

export const changePassword = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ token đã giải mã trong middleware
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  try {
    await changePasswordService(userId, currentPassword, newPassword);
    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const sendPasswordReset = async (req, res) => {
  const userId = req.user.id;
  try {
    await sendNewPasswordService(userId);
    return res.json({ message: "OTP sent to email" });
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
