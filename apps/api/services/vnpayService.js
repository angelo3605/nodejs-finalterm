import dayjs from "dayjs";
import crypto from "crypto";
import { updateOrderStatusService } from "./orderService.js";
import { postCheckoutService } from "./checkoutService.js";

const sortObject = (o) =>
  Object.keys(o)
    .sort()
    .reduce((newO, key) => ({ ...newO, [key]: o[key] }), {});

const checkHash = (vnpParams) => {
  const secureHash = vnpParams.vnp_SecureHash;

  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = sortObject(vnpParams);
  const signData = new URLSearchParams(sortedParams).toString();

  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
};

export const getVnpayPaymentUrl = ({ order, ipAddr, bankCode, orderType = "fashion", language = "vn", expireMinutes = 15 }) => {
  const { VNP_TMNCODE: tmnCode, VNP_HASHSECRET: secretKey, VNP_URL: vnpUrl, VNP_RETURNURL: returnUrl } = process.env;

  const now = dayjs();
  const createDate = now.format("YYYYMMDDHHmmss");
  const expireDate = now.add(expireMinutes, "minute").format("YYYYMMDDHHmmss");
  const orderInfo = `Payment for Order ${order.id}`;

  const vnpParams = {
    vnp_Version: "2.1.1",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: "VND",
    vnp_TxnRef: order.id,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: order.totalAmount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  if (bankCode) {
    vnpParams.vnp_BankCode = bankCode;
  }

  const sortedParams = sortObject(vnpParams);
  const searchParams = new URLSearchParams(sortedParams);

  const hmac = crypto.createHmac("sha512", secretKey);
  sortedParams.vnp_SecureHash = hmac.update(Buffer.from(searchParams.toString(), "utf-8")).digest("hex");

  return `${vnpUrl}?${new URLSearchParams(sortedParams).toString()}`;
};

export const handleVnpayIpn = async (vnpParams) => {
  if (!checkHash(vnpParams)) {
    return { RspCode: "97", Message: "Checksum failed" };
  }

  return { RspCode: "00", Message: "Success" };
};

export const handleVnpayCallback = async (vnpParams, { userId, guestId, redirectUrl }) => {
  if (!checkHash(vnpParams)) {
    throw new Error(`VNPay responded with code '${vnpParams.vnp_ResponseCode}'`);
  }

  await updateOrderStatusService(vnpParams.vnp_TxnRef, {
    status: vnpParams.vnp_ResponseCode === "00" ? "PROCESSING" : "CANCELLED",
  });
  await postCheckoutService({ userId, guestId, orderId: vnpParams.vnp_TxnRef });

  const newRedirectUrl = new URL(redirectUrl);
  for (const [key, value] of [
    ["status", vnpParams.vnp_ResponseCode],
    ["orderId", vnpParams.vnp_TxnRef],
    ["orderInfo", vnpParams.vnp_OrderInfo],
  ]) {
    newRedirectUrl.searchParams.set(key, value);
  }

  return newRedirectUrl.toString();
};
