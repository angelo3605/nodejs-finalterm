import { handleVnpayCallback, handleVnpayIpn } from "../services/vnpayService.js";

export const vnpayIpn = async (req, res) => {
  const data = await handleVnpayIpn(req.query);
  return res.json(data);
};

export const vnpayCallback = async (req, res) => {
  const redirectUrl = handleVnpayCallback(req.query, {
    redirectUrl: process.env.STORE_URL,
  });
  return res.redirect(redirectUrl);
};
