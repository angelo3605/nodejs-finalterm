import express from 'express';
const router = express.Router();
import authRouter from './authRoutes.js'
import userRouter from './userRoutes.js'
import transactionRoutes from './transactionRoutes.js'
import otpRoutes from './otpRoutes.js'
import authMiddleware from '../middleware/authMiddleware.js';

// router -> controller -> service

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

// router.use(authMiddleware);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/trade', transactionRoutes);
router.use('/code', otpRoutes);

export default router; 