import { Router } from "express";

import { upload } from "../utils/imageUpload.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { imageSchema } from "@mint-boutique/zod-schemas";
import { deleteImage, getAllImages, getImageById, updateImage, uploadImage } from "../controllers/imageController.js";

const imageRouter = Router();

imageRouter.use(requireAuth, checkRole("ADMIN"));

imageRouter.post("/upload", upload.single("file"), uploadImage);

imageRouter.get("/", getAllImages);

imageRouter.get("/:id", getImageById);
imageRouter.patch("/:id", validate(imageSchema), updateImage);
imageRouter.delete("/:id", deleteImage);

export default imageRouter;
