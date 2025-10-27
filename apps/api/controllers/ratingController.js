import { getAverageRatingService, getRatingsService, upsertRatingService } from "../services/ratingService.js";

export const rateProduct = async (req, res) => {
  const { stars, review } = req.body;
  const rating = await upsertRatingService({
    userId: req.user.id,
    productSlug: req.params.slug,
    stars,
    review,
  });
  return res.json({ rating });
};

export const getRatings = async (req, res) => {
  const ratings = await getRatingsService({
    productSlug: req.params.slug,
  });
  const avgRating = await getAverageRatingService({
    productSlug: req.params.slug,
  });
  return res.json({ ratings, avgRating });
};
