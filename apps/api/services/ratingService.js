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
};

export const getRatingsService = async ({ productSlug }) => {
  return await prisma.rating.findMany({
    where: { productSlug },
    select: ratingSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getAverageRatingService = async ({ productSlug }) => {
  const rating = await prisma.rating.aggregate({
    where: { productSlug },
    _avg: { stars: true },
    _count: { stars: true },
  });
  return {
    stars: rating._avg.stars || 0,
    numOfReviews: rating._count.stars,
  };
};

export const upsertRatingService = async ({ userId, productSlug, stars, review }) => {
  return await prisma.rating.upsert({
    where: { userId_productSlug: { userId, productSlug } },
    update: { stars, review },
    create: {
      userId,
      productSlug,
      stars,
      review,
    },
    select: ratingSelect,
  });
};
