import { createCommentService, deleteCommentService, getAllCommentsService, getCommentByIdService } from "../services/commentService.js";
import { getIo } from "../utils/socket.js";

// TODO: Fix WebSocket

export const createComment = async (req, res) => {
  const comment = await createCommentService(
    {
      productSlug: req.params.slug,
    },
    {
      userId: req.user?.id,
      guestId: req.guestId,
    },
    req.body,
  );

  // getIo().of("/comments").to(req.params.slug).emit("comment:new", comment);

  return res.json({
    data: comment,
  });
};

export const getCommentById = async (req, res) => {
  const comment = await getCommentByIdService(req.params.id);
  return res.json({
    data: comment,
  });
};

export const getAllComments = async (req, res) => {
  const comments = await getAllCommentsService({
    productSlug: req.params.slug,
  });
  return res.json({
    data: comments,
  });
};

export const deleteComment = async (req, res) => {
  const comment = await deleteCommentService(
    req.params.id,
    {
      userId: req.user?.id,
      guestId: req.guestId,
    },
    {
      forceDelete: req.user?.role === "ADMIN",
    },
  );

  // getIo().of("/comments").to(req.params.slug).emit("comment:delete", comment);

  return res.json({
    data: comment,
  });
};
