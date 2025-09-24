import { changeIsDefaultService, createShippingAddressService, deleteShippingInfoService, getAllShippingInfoService } from "../services/shippingInfoService.js";

export const getAllShippingInfo = async (req, res) => {
  const userId = req.user.id;
  try {
    const listOfShippingInfo = await getAllShippingInfoService(userId);
    return res.json(listOfShippingInfo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createShippingAddress = async (req, res) => {
  const userId = req.user.id;
  console.log("check userID: ",userId);
  const { fullName, address, phoneNumber } = req.body;
  try {
    const newInfo = await createShippingAddressService(userId, fullName, address, phoneNumber);
    return res.json(newInfo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const changeIsDefault = async (req, res) => {
  const userId = req.user.id;
  const { infoShippingid } = req.body;
  try {
    const isDefault = await changeIsDefaultService(userId, infoShippingid);
    return res.json(isDefault);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteShippingInfo = async (req, res) => {
  const userId = req.user.id;
  const { infoShippingid } = req.body;
  try {
    const isDeleted = await deleteShippingInfoService(userId, infoShippingid);
    return res.json(isDeleted);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
