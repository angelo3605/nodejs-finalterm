import prisma from "../prisma/prismaClient.js";

export const createCommentService = async ({ message, productId, parentId, userId, anonymousUserId }) => {
  try {
    const comments = await prisma.comment.create({
      data: {
        message,
        productId,
        parentId: parentId || null,
        userId: userId || null ,
        anonymousUserId: anonymousUserId || null,
      },
    });
    return comments;
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
