import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import sendEmail from '../utils/sendEmail.js'


export const changePasswordService = async (userId, currentPassword, newPassword) => {
  try {
    // Tìm user theo id
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const sendPasswordResetOTPService = async (email) => {
  try {

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    await prisma.passwordResetToken.create({
      data: {
        token: otp,
        userId: user.id,
        expiresAt
      }
    });

    // Gửi email
    await sendEmail({
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP code is ${otp}. It will expire in 15 minutes.`
    });

    return res.json({ message: 'OTP sent to email' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const resetPasswordWithOTPService = async (email, otp, newPassword) => {
  try {

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: otp,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!tokenRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    await prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id }
    });

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateUserFullNameService = async (userId, fullName) => {
  if (!fullName) throw new Error("fullName is required");

  await prisma.user.update({
    where: { id: userId },
    data: { fullName }
  });

  return { message: "User fullName updated successfully" };
};


export const upsertShippingAddressService = async (userId, { address, phoneNumber, isDefault }) => {
  if (!address || !phoneNumber) throw new Error("Address and phoneNumber are required");

  // Kiểm tra địa chỉ có tồn tại cho user chưa
  const existingAddress = await prisma.shippingAddress.findFirst({
    where: {
      userId,
      address,
      phoneNumber
    }
  });

  if (existingAddress) {
    // Update isDefault nếu cần
    await prisma.shippingAddress.update({
      where: { id: existingAddress.id },
      data: {
        isDefault: isDefault ?? existingAddress.isDefault
      }
    });
  } else {
    // Tạo mới địa chỉ
    await prisma.shippingAddress.create({
      data: {
        userId,
        address,
        phoneNumber,
        isDefault: isDefault ?? false
      }
    });
  }

  // Nếu isDefault = true thì bỏ isDefault của các địa chỉ khác đi
  if (isDefault) {
    await prisma.shippingAddress.updateMany({
      where: {
        userId,
        NOT: { address, phoneNumber }
      },
      data: { isDefault: false }
    });
  }

  return { message: "Shipping address upserted successfully" };
};


export const updateLoyaltyPoints = async (userId, totalAmount) => {
  try {
    const pointsEarned = Math.floor(totalAmount * 0.1);  // 10% của tổng giá trị đơn hàng

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { increment: pointsEarned } },  // Tăng điểm người dùng
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Error updating loyalty points: " + error.message);
  }
};


