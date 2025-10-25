import { Router } from "express";
import { createCommentController, getCommentsByProductController } from "../controllers/commentController.js";
import { extractUserId } from "../middlewares/authMiddleware.js";

const commentRouter = Router();

commentRouter.post("/", extractUserId, createCommentController);

commentRouter.get("/:productId", getCommentsByProductController);

export default commentRouter;
