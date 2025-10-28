import { checkoutService, guestCheckoutService } from "../services/checkoutService.js";
import { getVnpayPaymentUrl } from "../services/vnpayService.js";
import { getIpAddress } from "../utils/ipAddress.js";

export const checkout = async (req, res) => {
  const { shippingAddressId, discountCode, loyaltyPointsToUse } = req.body;
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
  console.log(vnpayUrl);
  return res.redirect(vnpayUrl);
};

export const guestCheckout = async (req, res) => {
  const { email, fullName, address, phoneNumber, discountCode } = req.body;
  const order = await guestCheckoutService({
    guestId: req.guestId,
    email,
    fullName,
    address,
    phoneNumber,
    discountCode,
  });
  const vnpayUrl = getVnpayPaymentUrl({
    order,
    ipAddr: getIpAddress(req),
    language: "en",
  });
  return res.redirect(vnpayUrl);
};
