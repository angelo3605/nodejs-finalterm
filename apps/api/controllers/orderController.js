import { getAllOrdersService, updateOrderStatusService } from "../services/orderService.js";

export const getAllOrders = async (req, res) => {
  const orders = await getAllOrdersService({});
  return res.json({ orders });
};

export const getMyOrders = async (req, res) => {
  const orders = await getAllOrdersService({
    userId: req.user.id,
  });
  return res.json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  const order = await updateOrderStatusService(req.params.id, {
    status: req.body.status,
  });
  return res.json({ order });
};

/* import {
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
};

export const getAllOrderByUser = async (req, res) => {
  const userId = req.user.id;
  const orders = await getOrderDetailsByIdService(userId);
  return res.status(200).json({ orders });
};

export const getDetailOrderByUser = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const order = await getOrderDetailsByIdService(userId, orderId);
  return res.status(200).json({ order });
};

// Cập nhật trạng thái đơn hàng
export const modifyOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const updatedOrder = await updateOrderStatusService(orderId, status);
  return res.json({ updatedOrder });
};

// Lấy tất cả đơn hàng
export const listOrders = async (req, res) => {
  const orders = await getAllOrdersService();
  return res.json({ orders });
};

export const getDetailOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await getOrderDetailsByIdService(orderId);

  return res.json({ order });
};

export const getAllOrder = async (req, res) => {
  const orders = await getAllOrdersService();

  return res.json({ orders });
}; */
