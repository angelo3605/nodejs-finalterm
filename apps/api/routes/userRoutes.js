import express from 'express';
const userRoutes = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';

// userRoutes.post('/student', findMore)

export default userRoutes;