import { createCommentService, deleteCommentService, getAllCommentsService, getCommentByIdService } from "../services/commentService.js";
import { getIo } from "../utils/socket.js";

export const createComment = async (req, res) => {
  const { message, parentId } = req.body;
  const { slug } = req.params;

  const comment = await createCommentService({
    productSlug: slug,
    userId: req.user?.id,
    guestId: req.guestId,
    message,
    parentId,
  });

  getIo().of("/comments").to(slug).emit("comment:new", comment);

  return res.json({ comment });
};

export const getCommentById = async (req, res) => {
  const comment = await getCommentByIdService(req.params.id);
  return res.json({ comment });
};

export const getAllComments = async (req, res) => {
  const comments = await getAllCommentsService({
    productSlug: req.params.slug,
  });
  return res.json({ comments });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  const oldComment = await getCommentByIdService(id, true);
  if (oldComment.userId !== req.user?.id && req.user?.role !== "ADMIN") {
    return res.status(401).json({ message: "Not allowed" });
  }

  const comment = await deleteCommentService(id);
  return res.json({ comment });
};
