import {Router} from "express";
import {getWard} from "../controllers/ghnController.js";

const ghnRouter = Router();

ghnRouter.get("/ward", getWard);

export default ghnRouter;
