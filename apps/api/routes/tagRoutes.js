import { Router } from "express";
import { getAllTags } from "../controllers/productController.js";

const tagRouter = new Router();

tagRouter.get("/", getAllTags);

export default tagRouter;
