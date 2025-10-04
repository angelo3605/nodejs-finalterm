import prisma from "../prisma/prismaClient.js";

export const createRatingService = async (userId, productId, stars) => {
  try {
    const existingRating = await prisma.rating.findFirst({
      where: { userId, productId },
    });

    if (existingRating) {
      throw new Error("User has already rated this product");
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        productId,
        stars,
      },
    });

    return newRating;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRatingsByProductService = async (productId) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { productId },
    });

    return ratings;
  } catch (error) {
    throw new Error(error.message);
  }
};