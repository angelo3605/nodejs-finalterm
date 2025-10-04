import { createCommentService, getCommentsByProductService } from "../services/commentService";

export const createCommentController = async (req, res) => {
  const userId = req.user.id;
  const { productId, message, parentId } = req.body;
  try {
    const comment = await createCommentService(userId, productId, message, parentId);
    
    req.io.emit('newComment', productId);

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
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
