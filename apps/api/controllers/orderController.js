import { checkoutGuestService, checkoutService, postOrderUpdates } from "../services/orderService.js";
import prisma from "../prisma/prismaClient.js";


export const checkout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      const { shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = [] } = req.body;

      const order = await checkoutService(null, userId, shippingAddressId, discountCode, loyaltyPointsToUse, cartItemIds);

      const discountRecord = order.discountCodeId ? { id: order.discountCodeId } : null;

      await postOrderUpdates(prisma, userId, loyaltyPointsToUse, order.sumAmount, discountRecord, cartItemIds);

      return res.status(201).json(order);
    } else {
      const { shippingInfo, discountCode, loyaltyPointsToUse = 0, cartItems = [] } = req.body;

      const { order, userId: guestUserId, cartItemIds, discountCodeId, totalAmount } = await checkoutGuestService(shippingInfo, discountCode, loyaltyPointsToUse, cartItems);

      const discountRecord = discountCodeId ? { id: discountCodeId } : null;

      await postOrderUpdates(prisma, guestUserId, loyaltyPointsToUse, totalAmount, discountRecord, cartItemIds);

      return res.status(201).json(order);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
