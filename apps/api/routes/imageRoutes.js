import { Router } from "express";

import { upload } from "../utils/imageUpload.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { imageSchema } from "@mint-boutique/zod-schemas";
import { deleteImage, getAllImages, getImageById, updateImage, uploadImage } from "../controllers/imageController.js";

const imageRouter = Router();

imageRouter.get("/", getAllImages);
imageRouter.get("/:id", getImageById);

imageRouter.post("/upload", requireAuth, checkRole("ADMIN"), upload.single("file"), uploadImage);
imageRouter.patch("/:id", requireAuth, checkRole("ADMIN"), validate(imageSchema), updateImage);
imageRouter.delete("/:id", requireAuth, checkRole("ADMIN"), deleteImage);

export default imageRouter;
