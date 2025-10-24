import prisma from "../prisma/client.js";

export const rateProductService = async (userId, productId, stars) => {
  const existingRating = await prisma.rating.findFirst({ where: { userId, productId } });
  if (existingRating) throw new Error("You have already rated this product");

  return await prisma.rating.create({ data: { userId, productId, stars } });
};

export const getProductRatingsService = async (productId) => {
  if (!productId) throw new Error("Product ID is required");

  return await prisma.rating.findMany({ where: { productId } });
};

export const updateProductRatingService = async (userId, productId, stars) => {
  if (!userId || !productId || stars == null) throw new Error("Missing required fields");

  return await prisma.rating.upsert({
    where: { userId_productId: { userId, productId } },
    update: { stars, updatedAt: new Date() },
    create: { userId, productId, stars },
  });
};
