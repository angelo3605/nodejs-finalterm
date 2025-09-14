import prisma from "../prisma/prismaClient.js";
import { createAndSendOTPService, verifiOtpForTransaction } from "./otpService.js";
import nodemailer from 'nodemailer';


export const transferTuitionService = async (payerMssv, receiverMssv) => {
    const payer = await prisma.customer.findUnique({
        where: { mssv: payerMssv },
        select: { email: true, balance: true }
    });
    if (!payer) throw new Error('Người nộp không tồn tại');

    const receiver = await prisma.customer.findUnique({
        where: { mssv: receiverMssv },
        select: { full_name: true, tuition_total: true, tuition_due: true, status: true }
    });
    if (!receiver) throw new Error('Người nhận (sinh viên) không tồn tại');

    if (receiver.status === "PAID" || receiver.tuition_due === 0) {
        throw new Error("Sinh viên đã hoàn tất học phí");
    }

    const existingLock = await prisma.transactionLock.findFirst({
        where: { receiver_mssv: receiverMssv, released_at: null },
    });
    if (existingLock) throw new Error('Đang có giao dịch với sinh viên này.');

    // Kiểm tra payer có giao dịch đang xử lý không
    const ongoingTransaction = await prisma.transaction.findFirst({
        where: { payer_mssv: payerMssv, is_processing: true },
    });
    if (ongoingTransaction) throw new Error('Người nộp đang có giao dịch xử lý.');

    // ạo lock cho receiver
    await prisma.transactionLock.create({
        data: { receiver_mssv: receiverMssv },
    });

    const transaction = await prisma.transaction.create({
        data: {
            payer_mssv: payerMssv,
            receiver_mssv: receiverMssv,
            amount: receiver.tuition_total,
            status: "PENDING",
            is_processing: true
        }
    });

    const otpResult = await createAndSendOTPService(transaction.id, payer.email);

    return {
        message: 'Khởi tạo giao dịch thành công',
        transaction,
        otp: otpResult.otp
    };
};



export const confirmTransfer = async (transactionId, otp) => {
    try {
        await verifiOtpForTransaction(transactionId, otp);

        const transaction = await prisma.transaction.findUnique({
            where: { id: parseInt(transactionId, 10) },
        });
        if (!transaction) throw new Error('Transaction not found');

        const payer = await prisma.customer.findUnique({
            where: { mssv: transaction.payer_mssv }
        });

        const receiver = await prisma.customer.findUnique({
            where: { mssv: transaction.receiver_mssv }
        });

        if (!payer || !receiver) throw new Error('Người nộp hoặc người nhận không tồn tại');

        if (payer.balance < transaction.amount) {
            throw new Error('Số dư tài khoản không đủ');
        }

        let newBalance = payer.balance - transaction.amount;

        await prisma.customer.update({
            where: { mssv: payer.mssv },
            data: { balance: newBalance }
        });

        await prisma.customer.update({
            where: { mssv: receiver.mssv },
            data: {
                tuition_due: 0,
                status: "PAID"
            }
        });

        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { is_processing: false, status: "COMPLETED" }
        });

        // Giải phóng lock
        const lock = await prisma.transactionLock.findFirst({
            where: { receiver_mssv: receiver.mssv, released_at: null }
        });
        if (lock) {
            await prisma.transactionLock.update({
                where: { id: lock.id },
                data: { released_at: new Date() }
            });
        }

        await prisma.ledger.create({
            data: {
                mssv: payer.mssv,
                delta: -transaction.amount,
                balance_after: newBalance,
                type: 'TUITION_PAYMENT',
                ref_transaction: transaction.id,
            },
        });

        await sendMailSuccess(
            payer.email,
            receiver.full_name,
            transaction.amount,
            receiver.mssv
        );

        return { message: "Transaction completed successfully" };
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
};


const sendMailSuccess = (email, fullname, tuition, mssv) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    const tuitionFormatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(tuition);

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "TRANSACTION SUCCESSFUL",
        text: `Your payment for the tuition fee of student ${fullname} (ID: ${mssv}) has been successfully processed with the amount of ${tuitionFormatted}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
