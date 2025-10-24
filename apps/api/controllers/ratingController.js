import { rateProductService, getProductRatingsService, updateProductRatingsService } from "../services/ratingService.js";

export const createRatingController = async (req, res) => {
  const userId = req.user.id;
  const { productId, stars } = req.body;

  const rating = await rateProductService(userId, productId, stars);

  req.io.emit("newRating", productId);

  return res.status(201).json(rating);
};

export const getRatingsByProductController = async (req, res) => {
  const { productId } = req.params;

  const ratings = await getProductRatingsService(productId);
  return res.status(200).json(ratings);
};

export const upsertRatingController = async (req, res) => {
  const userId = req.user.id;
  const { productId, stars } = req.body;

  const rating = await updateProductRatingsService(userId, productId, stars);

  req.io.emit("newRating", productId);

  return res.status(200).json(rating);
};
