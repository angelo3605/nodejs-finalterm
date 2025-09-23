import express from 'express';
import checkAdmin from '../middleware/adminMiddleware.js';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesFromTrash,
  getCategoryBySlug,
  restoreCategory,
  updateCategory,
} from '../controllers/categoryController.js';
import { passport } from '../utils/passport.js';
import { validate } from '../middleware/zodMiddleware.js';
import { categorySchema } from '../schemas/categorySchema.js';

const categoryRouter = express.Router();

categoryRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  validate(categorySchema),
  createCategory
);
categoryRouter.get('/', getCategories);
categoryRouter.get(
  '/trash',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  getCategoriesFromTrash
);
categoryRouter.get('/:slug', getCategoryBySlug);
categoryRouter.put(
  '/:slug',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  updateCategory
);
categoryRouter.delete(
  '/:slug',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  deleteCategory
);
categoryRouter.patch(
  '/:slug/restore',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  restoreCategory
);

export default categoryRouter;
