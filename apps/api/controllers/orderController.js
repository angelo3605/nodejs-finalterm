import { getAllOrdersService, updateOrderStatusService } from "../services/orderService.js";

export const getAllOrders = async (req, res) => {
  const data = await getAllOrdersService({}, req.pagination);
  return res.json(data);
};

export const getMyOrders = async (req, res) => {
  const data = await getAllOrdersService(
    {
      userId: req.user.id,
    },
    req.pagination,
  );
  return res.json(data);
};

export const updateOrderStatus = async (req, res) => {
  const order = await updateOrderStatusService(req.params.id, {
    status: req.body.status,
  });
  return res.json({
    data: order,
  });
};
