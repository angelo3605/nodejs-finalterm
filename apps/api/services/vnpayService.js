import dayjs from "dayjs";
import qs from "querystring";
import crypto from "crypto";

const sortObject = (o) =>
  Object.keys(o)
    .sort()
    .reduce((newO, key) => ({ ...newO, [key]: newO[key] }), {});

export const getVnpayPaymentUrl = ({ amount, bankCode, orderDesc, orderType, ipAddr, language = "vn" }) => {
  const { VNP_TMNCODE: tmnCode, VNP_HASHSECRET: secretKey, VNP_URL: vnpUrl, VNP_RETURNURL: returnUrl } = process.env;

  const date = dayjs();

  const createDate = date.format("yyyymmddHHmmss");
  const orderId = date.format("HHmmss");

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDesc,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100.0,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnpParams.vnp_BankCode = bankCode;
  }

  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", secretKey);
  sortedParams.vnp_SecureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return `vnpUrl?${qs.stringify(sortedParams, { encode: false })}`;
};

export const handleVnpayIpn = (vnpParams) => {
  const secureHash = vnpParams.vnp_SecureHash;

  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash !== signed) {
    return "97";
  }

  return "00";
};
