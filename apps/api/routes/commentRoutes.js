import express from "express";
import {
  createCommentController,
  getCommentsByProductController,
} from "../controllers/commentController.js";
import { extractUserId } from "../middleware/middleware.js";

const commentRoutes = express.Router();

commentRoutes.post("/", extractUserId,createCommentController);

commentRoutes.get("/:productId", getCommentsByProductController);

export default commentRoutes;
