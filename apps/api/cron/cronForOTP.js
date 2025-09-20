import prisma from '../prisma/prismaClient.js';
import cron from 'node-cron';

export const updateExpiresOTP = () => {
    // chạy mỗi phút check otp hết hạn
    cron.schedule('*/1 * * * *', () => {
        console.log("🔄 Running OTP expiry job...");
        processExpiredOtps();
    });
}


const processExpiredOtps = async () => {
    const now = new Date();

    // Tìm OTP chưa dùng, đã hết hạn
    const expiredOtps = await prisma.otp.findMany({
        where: {
            used: false,
            expires_at: { lt: now }
        }
    });

    for (const otp of expiredOtps) {
        // Hủy transaction
        await prisma.transaction.update({
            where: { id: otp.transaction_id },
            data: {
                is_processing: false,
                status: 'CANCELLED'
            }
        });

        // Giải phóng transactionLock nếu có
        const transaction = await prisma.transaction.findUnique({
            where: { id: otp.transaction_id }
        });

        await prisma.transactionLock.updateMany({
            where: {
                receiver_mssv: transaction.mssv,
                released_at: null
            },
            data: {
                released_at: new Date()
            }
        });

        // Đánh dấu OTP đã xử lý (optional)
        await prisma.otp.update({
            where: { id: otp.id },
            data: { used: true }
        });

        console.log(`Expired OTP ${otp.id} processed.`);
    }
};
