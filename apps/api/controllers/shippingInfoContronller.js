import { setDefaultShippingAddressService, addShippingAddressService, deleteShippingAddressService, getShippingAddressesByUserService } from "../services/shippingInfoService.js";

export const getAllShippingInfo = async (req, res) => {
  const userId = req.user.id;
  const shippingAddresses = await getShippingAddressesByUserService(userId);
  return res.json({ shippingAddresses });
};

export const createShippingAddress = async (req, res) => {
  const userId = req.user.id;
  const { fullName, address, phoneNumber } = req.body;
  const newShippingAddress = await addShippingAddressService(userId, fullName, address, phoneNumber);
  return res.status(201).json({ newShippingAddress });
};

export const changeIsDefault = async (req, res) => {
  const userId = req.user.id;
  const { infoShippingid } = req.body;
  const updatedShippingAddress = await setDefaultShippingAddressService(userId, infoShippingid);
  return res.json({ updatedShippingAddress });
};

export const deleteShippingInfo = async (req, res) => {
  const userId = req.user.id;
  const { infoShippingid } = req.body;
  const deletedShippingAddress = await deleteShippingAddressService(userId, infoShippingid);
  return res.json({ deletedShippingAddress });
};
