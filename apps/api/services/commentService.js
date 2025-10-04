import prisma from "../prisma/prismaClient.js";

export const createCommentService = async (userId, productId, message, parentId = null) => {
  try {
    const newComment = await prisma.comment.create({
      data: {
        message,
        userId, 
        productId,
        parentId, // Nếu là comment trả lời thì truyền vào parentId
      },
    });

    return newComment;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCommentsByProductService = async (productId) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { productId },
      include: {
        replies: true, 
      },
    });

    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};
