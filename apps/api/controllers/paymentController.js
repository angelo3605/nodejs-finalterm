import prisma from "../prisma/prismaClient.js";
import { VNPay, ProductCode, dateFormat, ignoreLogger } from "vnpay";

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_SECRET,
  vnpayHost: process.env.VNPAY_HOST, 
  testMode: true, // nếu đang test sandbox
  hashAlgorithm: "SHA512",
  loggerFn: ignoreLogger,
});

export const createQr = async (req, res) => {
  try {
    const { orderId, returnUrl } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Thiếu orderId" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại" });
    }

    const payment = await prisma.payment.create({
      data: {
        transactionId: "",
        method: "vnpay",
        currency: "VND",
        amount: order.totalAmount,
        status: "PENDING",
        order: { connect: { id: order.id } },
      },
    });

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId: payment.id },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_TmnCode: process.env.VNPAY_TMN_CODE,
      vnp_Amount: (order.totalAmount) * 1000 , 
      vnp_Command: "pay",
      vnp_TxnRef: updatedPayment.transactionId,
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl || `http://localhost:${process.env.PORT}/payment/check-payment-vnpay`,
      vnp_Locale: "vn",
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    };
    console.log("vnp_Amount", vnp_Params.vnp_Amount)
    const paymentUrl = await vnpay.buildPaymentUrl(vnp_Params);

    return res.status(200).json({
      success: true,
      url: paymentUrl,
      orderId: order.id,
      paymentId: updatedPayment.id,
    });
  } catch (error) {
    console.error("createQr error:", error);
    return res.status(500).json({ success: false, message: error.message || "Lỗi server" });
  }
};

export const checkPayment = async (req, res) => {
  try {
    const query = req.query;

    // Xác nhận chữ ký trả về từ VNPAY
    const verify = await vnpay.verifyReturnUrl(query);

    if (!verify.isVerified) {
      return res.status(400).send("<h2>❌ Chữ ký không hợp lệ!</h2>");
    }

    const vnp_ResponseCode = query.vnp_ResponseCode;
    const txnRef = query.vnp_TxnRef; 
    const amountFromVnp = Number(query.vnp_Amount || 0) / 100;

    const payment = await prisma.payment.findFirst({
      where: { transactionId: txnRef },
    });
    if (!payment) {
      return res.status(404).send("<h2>Payment record not found</h2>");
    }

    const order = await prisma.order.findUnique({
      where: { id: payment.orderId },
    });
    if (!order) {
      return res.status(404).send("<h2>Order not found</h2>");
    }

    if (Math.round(order.totalAmount) !== Math.round(amountFromVnp)) {
      console.warn(`Mismatch amount for order ${order.id}: db=${order.totalAmount}, vnp=${amountFromVnp}`);
    }

    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PROCESSING" }, 
      });

      return res.send(`
        <h2 style="color: green;">Thanh toán thành công!</h2>
        <p>Mã giao dịch: ${txnRef}</p>
        <p>Đơn hàng: ${order.id}</p>
      `);
    } else {
      // Thanh toán thất bại
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      return res.send(`
        <h2 style="color: red;">Thanh toán thất bại hoặc bị hủy!</h2>
        <p>Mã lỗi: ${vnp_ResponseCode}</p>
      `);
    }
  } catch (error) {
    console.error("checkPayment error:", error);
    return res.status(500).send("<h2>🚫 Lỗi xác minh thanh toán!</h2>");
  }
};

