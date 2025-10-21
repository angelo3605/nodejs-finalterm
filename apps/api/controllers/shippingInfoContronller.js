import { setDefaultShippingAddressService, addShippingAddressService, deleteShippingAddressService, getShippingAddressesByUserService } from "../services/shippingInfoService.js";

export const getAllShippingInfo = async (req, res) => {
  const userId = req.user.id;
  try {
    const shippingAddresses = await getShippingAddressesByUserService(userId);
    return res.json({ shippingAddresses });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createShippingAddress = async (req, res) => {
  const userId = req.user.id;
  const { fullName, address, phoneNumber } = req.body;
  try {
    const newShippingAddress = await addShippingAddressService(userId, fullName, address, phoneNumber);
    return res.status(201).json({ newShippingAddress });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const changeIsDefault = async (req, res) => {
  const userId = req.user.id;
  const { infoShippingid } = req.body;
  try {
    const updatedShippingAddress = await setDefaultShippingAddressService(userId, infoShippingid);
    return res.json({ updatedShippingAddress });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteShippingInfo = async (req, res) => {
  const userId = req.user.id;
  const { infoShippingid } = req.body;
  try {
    const deletedShippingAddress = await deleteShippingAddressService(userId, infoShippingid);
    return res.json({ deletedShippingAddress });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
