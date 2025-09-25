import { addToCartService } from "../services/cartService.js";
import { checkoutService, createEmailFromOrderId, createGuestUser } from "../services/orderService.js";
import { createShippingAddressService } from "../services/shippingInfoService.js";

export const checkout = async (req, res) => {
  try {
    let userId = req.user?.id;

    if (userId) {
      const { shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = [] } = req.body;
      const order = await checkoutService(userId, shippingAddressId, discountCode, loyaltyPointsToUse, cartItemIds);
      return res.status(201).json(order);
    } else {
      const { shippingInfo, discountCode, loyaltyPointsToUse = 0, cartItems = [] } = req.body;

      const guestData = await createGuestUser();
      console.log("guestData.id: ", guestData.id);

      const shippingAddress = await createShippingAddressService(guestData.id, shippingInfo.fullName, shippingInfo.address, shippingInfo.phoneNumber);
      console.log("shippingAddress.id: ", shippingAddress.id);

      const cartItemIds = [];
      for (const item of cartItems) {
        const cartItem = await addToCartService(guestData.id, item.variantId, item.quantity);
        if (cartItem && cartItem.id) {
          cartItemIds.push(cartItem.id);
        }
      }

      const order = await checkoutService(guestData.id, shippingAddress.id, discountCode, loyaltyPointsToUse, cartItemIds);

      await createEmailFromOrderId(guestData.id, order.id);

      return res.status(201).json(order);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
