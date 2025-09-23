import express from 'express';
const router = express.Router();
import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import adminRouter from './adminRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import discountRoutes from './discountRoutes.js';
import brandRouter from './brandRoutes.js';
import categoryRouter from './categoryRoutes.js';
import { passport } from '../utils/passport.js';
import checkAdmin from '../middleware/adminMiddleware.js';

// router -> controller -> service

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.use('/admin', passport.authenticate('jwt', { session: false }), checkAdmin, adminRouter);
router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);
router.use('/discount', discountRoutes);

export default router;
