import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import { generateRandomString } from "../utils/randomStr.js";

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: "Password changed successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendNewPasswordService = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = generateRandomString(30);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("pass: ", newPassword)
    console.log("pass hash: ", hashedPassword)
    const subject = "Your New Password for Mint Boutique ";
    const text = `
        Hi [User's Name],

        As requested, your password has been reset.

        Here are your new login details:

        Email: ${user.email}
        Temporary Password: ${newPassword}

        For your security, please log in and change this temporary password as soon as possible.

        👉 Login Now

        If you did not request this password reset, please contact our support team immediately.

        Thank you,
        — The Mint Boutique Team
    `;
    // Gửi email
    await sendEmail(user.email, subject, text);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: "New password sent to email." };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserFullNameService = async (userId, fullName) => {
  if (!fullName) throw new Error("fullName is required");

  await prisma.user.update({
    where: { id: userId },
    data: { fullName },
  });

  return { message: "User fullName updated successfully" };
};



export const updateLoyaltyPoints = async (userId, totalAmount) => {
  try {
    const pointsEarned = Math.floor(totalAmount * 0.1); // 10% của tổng giá trị đơn hàng

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { increment: pointsEarned } }, // Tăng điểm người dùng
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Error updating loyalty points: " + error.message);
  }
};
