// import prisma from "../prisma/prismaClient.js";
// import { VNPay, ProductCode, dateFormat, ignoreLogger } from "vnpay";

// // Config
// const vnpay = new VNPay({
//   tmnCode: process.env.tmnCode,
//   secureSecret: process.env.secureSecret,
//   vnpayHost: process.env.vnpayHost,
//   testMode: true,
//   hashAlgorithm: "SHA512",
//   loggerFn: ignoreLogger,
// });

// export const createQr = async (req, res) => {
//   try {
//     const { orderId, returnUrl } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ success: false, message: "Thiếu orderId" });
//     }

//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//     });

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
//     }

//     // 1. Tạo payment bản ghi
//     const payment = await prisma.payment.create({
//       data: {
//         transactionId: "", // tạo xong rồi cập nhật
//         method: "vnpay",
//         currency: "VND",
//         amount: order.totalAmount,
//         status: "PENDING",
//         order: {
//           connect: { id: order.id },
//         },
//       },
//     });

//     // 2. Gán transactionId = payment.id
//     const updatedPayment = await prisma.payment.update({
//       where: { id: payment.id },
//       data: {
//         transactionId: payment.id,
//       },
//     });

//     // 3. Build URL VNPAY
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const vnp_Params = {
//       vnp_Version: "2.1.0",
//       vnp_TmnCode: process.env.tmnCode,
//       vnp_Amount: Math.round(order.totalAmount) * 100,
//       vnp_Command: "pay",
//       vnp_TxnRef: updatedPayment.transactionId,
//       vnp_OrderInfo: `Thanh toán đơn hàng #${order.id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: returnUrl || `http://localhost:${process.env.PORT}/payment/check-payment-vnpay`,
//       vnp_Locale: "vn",
//       vnp_IpAddr: req.ip || "127.0.0.1",
//       vnp_CreateDate: dateFormat(new Date()),
//       vnp_ExpireDate: dateFormat(tomorrow),
//     };

//     const { paymentUrl } = await vnpay.buildPaymentUrl(vnp_Params);

//     return res.status(200).json({
//       success: true,
//       message: "Tạo QR thành công",
//       url: paymentUrl,
//       orderId: order.id,
//       paymentId: updatedPayment.id,
//     });
//   } catch (error) {
//     console.error("Lỗi createQr:", error);
//     return res.status(500).json({ success: false, message: error.message || "Lỗi server" });
//   }
// };
