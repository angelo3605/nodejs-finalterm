import {
  guestCheckoutService,
  checkoutService,
  getOrderDetailsByIdService,
  updateOthersFromOrderByUserService,
  sendOrderConfirmationEmailWithAccountToGuestService,
  updateOrderStatusService,
  getAllOrdersService,
} from "../services/orderService.js";
import prisma from "../prisma/client.js";
import extractToken from "../utils/extractToken.js";
import jwt from "jsonwebtoken";

export const checkout = async (req, res) => {
  const token = extractToken(req);
  try {
    const userId = token ? jwt.verify(token, process.env.JWT_SECRET).id : null;

    if (userId) {
      const { shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = [] } = req.body;

      const order = await checkoutService(null, userId, shippingAddressId, discountCode, loyaltyPointsToUse, cartItemIds);

      const discountRecord = order.discountCodeId ? { id: order.discountCodeId } : null;

      await updateOthersFromOrderByUserService(prisma, userId, loyaltyPointsToUse, order.sumAmount, discountRecord, cartItemIds);

      return res.status(201).json({ order });
    } else {
      const { email, shippingInfo, discountCode, loyaltyPointsToUse = 0, cartItems = [] } = req.body;

      const { order, userId: guestUserId, password, cartItemIds, discountCodeId, totalAmount } = await guestCheckoutService(email, shippingInfo, discountCode, loyaltyPointsToUse, cartItems);

      const discountRecord = discountCodeId ? { id: discountCodeId } : null;

      await updateOthersFromOrderByUserService(prisma, guestUserId, loyaltyPointsToUse, totalAmount, discountRecord, cartItemIds);
      await sendOrderConfirmationEmailWithAccountToGuestService(email, password, order.id);

      return res.status(201).json({ order });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllOrderByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await getOrderDetailsByIdService(userId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getDetailOrderByUser = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  try {
    const order = await getOrderDetailsByIdService(userId, orderId);
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const modifyOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await updateOrderStatusService(orderId, status);
    return res.json({ updatedOrder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng
export const listOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDetailOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderDetailsByIdService(orderId);

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const orders = await getAllOrdersService();

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
