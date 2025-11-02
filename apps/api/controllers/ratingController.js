import { getAllRatingsService, getAverageRatingService, upsertRatingService } from "../services/ratingService.js";
import { getIo } from "../utils/socket.js";

export const rateProduct = async (req, res) => {
  const rating = await upsertRatingService(
    {
      productSlug: req.params.slug,
    },
    {
      userId: req.user.id,
    },
    req.body,
  );

  getIo().of("/ratings").to(req.params.slug).emit("rating:new", rating);

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
