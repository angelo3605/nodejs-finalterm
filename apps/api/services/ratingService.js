import prisma from "../prisma/client.js";

const ratingSelect = {
  id: true,
  stars: true,
  review: true,
  user: {
    select: {
      fullName: true,
    },
  },
  product: {
    select: {
      slug: true,
      name: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

export const getAllRatingsService = async ({ productSlug }) => {
  return prisma.rating.findMany({
    where: { productSlug },
    select: ratingSelect,
    orderBy: { updatedAt: "desc" },
  });
};

export const getAverageRatingService = async ({ productSlug }) => {
  const rating = await prisma.rating.aggregate({
    where: { productSlug },
    _avg: { stars: true },
    _count: { stars: true },
  });
  return {
    avgStar: rating._avg.stars || 0,
    numOfReviews: rating._count.stars,
  };
};

export const upsertRatingService = async ({ productSlug }, { userId }, data) => {
  return prisma.rating.upsert({
    where: {
      userId_productSlug: { userId, productSlug },
    },
    update: data,
    create: {
      userId,
      productSlug,
      ...data,
    },
    select: ratingSelect,
  });
};
