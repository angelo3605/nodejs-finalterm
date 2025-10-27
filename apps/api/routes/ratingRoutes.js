import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { getRatings, rateProduct } from "../controllers/ratingController.js";

const ratingRouter = new Router();

ratingRouter.get("/products/:slug/ratings", getRatings);
ratingRouter.post("/products/:slug/ratings", requireAuth, rateProduct);

export default ratingRouter;
