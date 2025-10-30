import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { getAllRatings, rateProduct } from "../controllers/ratingController.js";
import { restrictRoute } from "../middlewares/roleMiddleware.js";

const ratingRouter = new Router();

ratingRouter.get("/products/:slug/ratings", getAllRatings);
ratingRouter.post("/products/:slug/ratings", requireAuth, restrictRoute, rateProduct);

export default ratingRouter;
