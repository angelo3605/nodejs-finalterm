import prisma from "../prisma/client.js";


export const createCommentService = async (data) => {
  if (!data.message || !data.productId) {
    throw new Error("Message and productId are required");
  }
  return await prisma.comment.create({ data });
};

export const getCommentsByProductService = async (productId) => {
  const comments = await prisma.comment.findMany({
    where: { productId, parentId: null },
    include: {
      replies: { include: { user: true, anonymousUser: true } },
      user: true,
      anonymousUser: true,
    },
    orderBy: { createdAt: "desc" },
  });
  if (!comments.length) throw new Error("Comments not found");
  return comments;
};
