import prisma from "../prisma/client.js";
import { getUserByIdService } from "./userService.js";

const commentSelect = {
  id: true,
  message: true,
  senderName: true,
  createdAt: true,
  product: {
    select: {
      slug: true,
      name: true,
    },
  },
  replies: {
    select: {
      message: true,
      senderName: true,
      createdAt: true,
    },
  },
};

export const getAllCommentsService = async ({ productSlug }) => {
  return await prisma.comment.findMany({
    where: {
      productSlug,
      parent: null,
    },
    select: commentSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getCommentByIdService = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: commentSelect,
  });
  return comment;
};

export const createCommentService = async ({ productSlug }, { userId, guestId }, data) => {
  const { message, parentId } = data;

  let user;

  try {
    user = await getUserByIdService(userId);
  } catch {}

  if (parentId) {
    const parent = await getCommentByIdService(parentId);
    if (parent.parentId) {
      throw new Error("Replies to replies are not allowed");
    }
    if (parent.product.slug !== productSlug) {
      throw new Error("Parent comment belongs to another product");
    }
  }

  return await prisma.comment.create({
    data: {
      product: {
        connect: { slug: productSlug },
      },
      senderName: user?.fullName ?? "Anonymous",
      message,
      parent: parentId
        ? {
            connect: { id: parentId },
          }
        : undefined,
      userId,
      guestId,
    },
    select: commentSelect,
  });
};

export const deleteCommentService = async (id, { userId, guestId }, { forceDelete = false }) => {
  const identifier = userId ? { userId } : { guestId };
  await prisma.comment.deleteMany({
    where: {
      parentId: id,
      ...(forceDelete || identifier),
    },
  });
  return await prisma.comment.delete({
    where: {
      id,
      ...(forceDelete || identifier),
    },
  });
};
