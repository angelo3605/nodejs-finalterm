import {
  createShippingAddressService,
  deleteShippingAddressService,
  getAllShippingAddressesService,
  getShippingAddressByIdService,
  updateShippingAddressService,
} from "../services/shippingAddressService.js";

export const getMyShippingAddresses = async (req, res) => {
  const shippingAddresses = await getAllShippingAddressesService({
    userId: req.user.id,
  });
  return res.json({
    data: shippingAddresses,
  });
};

export const getMyShippingAddressById = async (req, res) => {
  const shippingAddress = await getShippingAddressByIdService(req.params.id, {
    userId: req.user.id,
  });
  return res.json({
    data: shippingAddress,
  });
};

export const createMyShippingAddress = async (req, res) => {
  const shippingAddress = await createShippingAddressService(
    {
      userId: req.user.id,
    },
    req.body,
  );
  return res.json({
    data: shippingAddress,
  });
};

export const updateMyShippingAddress = async (req, res) => {
  const shippingAddress = await updateShippingAddressService(
    req.params.id,
    {
      userId: req.user.id,
    },
    req.body,
  );
  return res.json({
    data: shippingAddress,
  });
};

export const deleteMyShippingAddress = async (req, res) => {
  const shippingAddress = await deleteShippingAddressService(req.params.id, {
    userId: req.user.id,
  });
  return res.json({
    data: shippingAddress,
  });
};
