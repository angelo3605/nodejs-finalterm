import { Router } from "express";
import { createComment, getAllComments, deleteComment } from "../controllers/commentController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { commentSchema } from "@mint-boutique/zod-schemas";
import { restrictRoute } from "../middlewares/roleMiddleware.js";

const commentRouter = new Router();

commentRouter.use(optionalAuth);

commentRouter.get("/products/:slug/comments", getAllComments);
commentRouter.post("/products/:slug/comments", restrictRoute, validate(commentSchema), createComment);
commentRouter.delete("/comments/:id", restrictRoute, deleteComment);

export default commentRouter;
