import { Router } from "express";
import { checkPayment, createQr } from "../controllers/paymentController.js";

const paymentRoutes = Router();

paymentRoutes.post("/create-qr", createQr);
paymentRoutes.get("/check-payment-vnpay", checkPayment);

export default paymentRoutes;
