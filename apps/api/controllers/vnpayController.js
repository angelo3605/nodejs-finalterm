import { handleVnpayCallback, handleVnpayIpn } from "../services/vnpayService.js";

export const vnpayIpn = async (req, res) => {
  const data = await handleVnpayIpn(req.query);
  return res.json(data);
};

export const vnpayCallback = async (req, res) => {
  const redirectUrl = await handleVnpayCallback(req.query, {
    redirectUrl: `${process.env.STORE_URL}/checkout/result`,
    userId: req.user?.id,
    guestId: req.guestId,
  });
  return res.redirect(redirectUrl);
};
