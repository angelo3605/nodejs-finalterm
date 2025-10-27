import { Router } from "express";
import { createComment, getAllComments, deleteComment } from "../controllers/commentController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const commentRouter = new Router();

commentRouter.use(optionalAuth);

commentRouter.get("/products/:slug/comments", getAllComments);
commentRouter.post("/products/:slug/comments", createComment);
commentRouter.delete("/comments/:id", deleteComment);

export default commentRouter;
