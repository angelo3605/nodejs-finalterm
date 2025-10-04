import express from "express";
import {
  createRatingController,
  getRatingsByProductController,
  upsertRatingController,
} from "../controllers/ratingController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const ratingRoutes = express.Router();

ratingRoutes.post("/", requireAuth, createRatingController);

ratingRoutes.put("/", requireAuth, upsertRatingController);

ratingRoutes.get("/:productId", getRatingsByProductController);

export default ratingRoutes;
