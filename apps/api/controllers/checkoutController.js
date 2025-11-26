import { checkoutService, guestCheckoutService } from "../services/checkoutService.js";
import { getVnpayPaymentUrl } from "../services/vnpayService.js";
import { getIpAddress } from "../utils/ipAddress.js";
import { guestCheckoutSchema, userCheckoutSchema } from "@mint-boutique/zod-schemas";

export const checkout = async (req, res) => {
  const { shippingAddressId, discountCode, loyaltyPointsToUse } = userCheckoutSchema.parse(req.body);
  const order = await checkoutService({
    userId: req.user.id,
    shippingAddressId,
    discountCode,
    loyaltyPointsToUse,
  });
  const vnpayUrl = getVnpayPaymentUrl({
    order,
    ipAddr: getIpAddress(req),
    language: "en",
  });
  return res.json({ redirect: vnpayUrl });
};

export const guestCheckout = async (req, res) => {
  const { email, fullName, address, province, district, ward, phoneNumber, discountCode } = guestCheckoutSchema.parse(req.body);
  const order = await guestCheckoutService({
    guestId: req.guestId,
    email,
    fullName,
    address,
    phoneNumber,
    discountCode,
    province,
    district,
    ward,
  });
  const vnpayUrl = getVnpayPaymentUrl({
    order,
    ipAddr: getIpAddress(req),
    language: "en",
  });
  return res.json({ redirect: vnpayUrl });
};
