import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkAdmin from '../middleware/adminMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategoryBySlug, updateCategory } from '../controllers/categoryController.js';
import { getCategoryServiceFromTrash, restoreCategoryService } from '../services/categoryService.js';
const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, checkAdmin, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/trash', authMiddleware, checkAdmin, getCategoryServiceFromTrash);
categoryRouter.get('/:slug', getCategoryBySlug);
categoryRouter.put('/:slug', authMiddleware, checkAdmin, updateCategory);
categoryRouter.delete('/:slug', authMiddleware, checkAdmin, deleteCategory);
// categoryRouter.patch('/:slug/restore', authMiddleware, checkAdmin, restoreCategoryService);

export default categoryRouter;