import {
  createGhnOrderService,
  getShipmentDetailsService,
  getShippingFeeService,
  getWardService
} from "../services/ghnService.js";

export const getWard = async (req, res) => {
  const ward = await getWardService(req.query?.district);
  return res.json({
    data: ward,
  });
};

export const createGhnOrder = async (req, res) => {
  const data = await createGhnOrderService(req.body.id, req.body);
  return res.json({ data });
};

export const getShipmentDetails = async (req, res) => {
  const data = await getShipmentDetailsService(req.body.id, {
    userId: req.user.id,
  });
  return res.json({ data });
};

export const getShippingFee = async (req, res) => {
  const fee = await getShippingFeeService(req.body);
  return res.json({
    data: fee,
  });
};
