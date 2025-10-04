import { createRatingService, getRatingsByProductService } from "../services/ratingService";

export const createRatingController = async (req, res) => {
  const userId = req.user.id;
  const { productId, stars } = req.body;
  try {
    const rating = await createRatingService(userId, productId, stars);

    req.io.emit("newRating", productId);

    return res.status(201).json(rating);
  } catch (error) {
    console.error("Error creating rating:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getRatingsByProductController = async (req, res) => {
  const { productId } = req.params;
  try {
    const ratings = await getRatingsByProductService(productId);
    return res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(500).json({ message: error.message });
  }
};
