import { Router } from "express";
import { vnpayCallback, vnpayIpn } from "../controllers/vnpayController.js";

const vnpayRouter = new Router();

vnpayRouter.get("/vnpay/ipn", vnpayIpn);
vnpayRouter.get("/vnpay/callback", vnpayCallback);

export default vnpayRouter;
