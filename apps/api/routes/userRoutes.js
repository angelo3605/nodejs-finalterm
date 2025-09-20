import express from 'express';
const userRoutes = express.Router();
import { findMore } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

userRoutes.post('/student', findMore)

export default userRoutes;