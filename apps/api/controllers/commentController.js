import { createCommentService, getCommentsByProductService } from "../services/commentService.js";

export const createCommentController = async (req, res) => {
  const { message, productId, parentId } = req.body;

  const comment = await createCommentService(message, productId, parentId, req.userId, req.user ? null : req.anonymousUserId);

  req.io.emit("newComment", productId);

  return res.status(201).json({ comment });
};

export const getCommentsByProductController = async (req, res) => {
  const { productId } = req.params;

  const comments = await getCommentsByProductService(productId);
  return res.status(200).json({ comments });
};
