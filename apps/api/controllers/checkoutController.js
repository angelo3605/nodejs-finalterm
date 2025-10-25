import { checkoutService, guestCheckoutService } from "../services/checkoutService.js";

export const checkout = async (req, res) => {
  const { shippingAddressId, discountCode, loyaltyPointsToUse } = req.body;
  const order = await checkoutService({
    userId: req.user.id,
    shippingAddressId,
    discountCode,
    loyaltyPointsToUse,
  });
  return res.json({ order });
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
  return res.json({ order });
};
