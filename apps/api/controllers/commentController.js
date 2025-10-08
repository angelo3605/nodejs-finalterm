import { createCommentService, getCommentsByProductService } from "../services/commentService.js";

export const createCommentController = async (req, res) => {
  const { message, productId, parentId } = req.body;

  try {
    const comment = await createCommentService({
      message,
      productId,
      parentId,
      userId: req.userId,
      anonymousUserId: req.user ? null : req.anonymousUserId,
    });

    // console.log("userId: req.user?.id: ", req.userId)
    req.io.emit("newComment", productId);
    return res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment failed:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentsByProductController = async (req, res) => {
  const { productId } = req.params;
  try {
    const comments = await getCommentsByProductService(productId);
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: error.message });
  }
};
