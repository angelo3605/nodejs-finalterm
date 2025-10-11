import { checkoutGuestService, checkoutService, orderDetailService, postOrderUpdates, sendInfoNewUser } from "../services/orderService.js";
import prisma from "../prisma/prismaClient.js";
import extractToken from "../utils/extractToken.js";
import jwt from "jsonwebtoken";

export const checkout = async (req, res) => {
  const token = extractToken(req);
  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    if (userId) {
      const { shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = [] } = req.body;

      const order = await checkoutService(null, userId, shippingAddressId, discountCode, loyaltyPointsToUse, cartItemIds);

      const discountRecord = order.discountCodeId ? { id: order.discountCodeId } : null;

      await postOrderUpdates(prisma, userId, loyaltyPointsToUse, order.sumAmount, discountRecord, cartItemIds);

      return res.status(201).json(order);
    } else {
      const { email, shippingInfo, discountCode, loyaltyPointsToUse = 0, cartItems = [] } = req.body;

      const { order, userId: guestUserId, password, cartItemIds, discountCodeId, totalAmount } = await checkoutGuestService(email, shippingInfo, discountCode, loyaltyPointsToUse, cartItems);

      const discountRecord = discountCodeId ? { id: discountCodeId } : null;

      await postOrderUpdates(prisma, guestUserId, loyaltyPointsToUse, totalAmount, discountRecord, cartItemIds);
      await sendInfoNewUser(email, password, order.id);
      return res.status(201).json(order);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  const userId = req.user.id;
  try {
    const order = await orderDetailService(userId);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getDetailOrder = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  try {
    const order = await orderDetailService(userId, orderId);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
