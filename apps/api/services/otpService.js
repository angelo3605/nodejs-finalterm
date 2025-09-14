import prisma from '../prisma/prismaClient.js';
import nodemailer from 'nodemailer';

function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export const createAndSendOTPService = async (transactionid, email) => {
    let otp = generateOTP();
    let now = new Date();
    let expiresAt = new Date(now.getTime() + 10 * 60 * 1000)


    await prisma.otp.create({
        data: {
            transaction_id: transactionid,
            code: otp,
            created_at: now,
            expires_at: expiresAt,
            used: false,
        }
    });


    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Transaction Verification",
        text: `Your OTP (valid for 5 minutes): ${otp}`
    }

    await transporter.sendMail(mailOptions);

    return { success: true, otp }
}

export const verifiOtpForTransaction = async (transactionId, inputOtp) => {
    const transactionIdInt = parseInt(transactionId, 10);
    const otpRecord = await prisma.otp.findUnique({
        where: { transaction_id: transactionIdInt }
    });

    if (!otpRecord) throw new Error('OTP not found');
    if (otpRecord.used) throw new Error('OTP already used');
    if (otpRecord.expires_at < new Date()) throw new Error('OTP expired');
    if (otpRecord.code !== inputOtp) throw new Error('Invalid OTP');

    await prisma.otp.update({
        where: { transaction_id: parseInt(transactionId, 10) },
        data: { used: true }
    });


    return { message: "OTP verifed successfully" };
};