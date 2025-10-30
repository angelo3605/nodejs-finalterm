import { getAverageRatingService, getAllRatingsService, upsertRatingService } from "../services/ratingService.js";

export const rateProduct = async (req, res) => {
  const rating = await upsertRatingService(
    {
      userId: req.user.id,
    },
    {
      productSlug: req.params.slug,
    },
    req.body,
  );
  return res.json({
    data: rating,
  });
};

export const getAllRatings = async (req, res) => {
  const ratings = await getAllRatingsService({
    productSlug: req.params.slug,
  });
  const avgRating = await getAverageRatingService({
    productSlug: req.params.slug,
  });
  return res.json({
    data: {
      ...avgRating,
      ratings,
    },
  });
};
