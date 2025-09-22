import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkAdmin from '../middleware/adminMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategoriesFromTrash, getCategoryBySlug, restoreCategory, updateCategory } from '../controllers/categoryController.js';
const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, checkAdmin, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/trash', authMiddleware, checkAdmin, getCategoriesFromTrash);
categoryRouter.get('/:slug', getCategoryBySlug);
categoryRouter.put('/:slug', authMiddleware, checkAdmin, updateCategory);
categoryRouter.delete('/:slug', authMiddleware, checkAdmin, deleteCategory);
categoryRouter.patch('/:slug/restore', authMiddleware, checkAdmin, restoreCategory);

export default categoryRouter;