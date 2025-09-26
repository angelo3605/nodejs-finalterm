import express from 'express';
import { changePassword, sendPasswordReset, updateFullName } from '../controllers/userController.js';
const userRoutes = express.Router();
import { passport } from "../utils/passport.js";
userRoutes.use(passport.authenticate("jwt", { session: false }));


userRoutes.post('/change', updateFullName)
userRoutes.post('/password', changePassword)
userRoutes.post('/reset', sendPasswordReset)


export default userRoutes;
