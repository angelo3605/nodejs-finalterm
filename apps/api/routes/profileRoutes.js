import { Router } from "express";
import { getMe } from "../controllers/profileController.js";

const profileRouter = new Router();

profileRouter.get("/", getMe);

export default profileRouter;
