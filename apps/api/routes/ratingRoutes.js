import { Router } from "express";
import {
  createRatingController,
  getRatingsByProductController,
  upsertRatingController,
} from "../controllers/ratingController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const ratingRouter = Router();

ratingRouter.get("/:productId", getRatingsByProductController);

ratingRouter.use(requireAuth);
ratingRouter.post("/", createRatingController);
ratingRouter.put("/", upsertRatingController);

export default ratingRouter;
