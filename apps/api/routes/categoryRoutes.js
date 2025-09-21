import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkAdmin from '../middleware/adminMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategoryBySlug, updateCategory } from '../controllers/categoryController.js';
import { getCategoryServiceFromTrash, restoreCategoryService } from '../services/categoryService.js';
const router = express.Router();

router.post('/category', authMiddleware, checkAdmin, createCategory);
router.get('/categories', getCategories);
router.get('/categories-trash', authMiddleware, checkAdmin, getCategoryServiceFromTrash);
router.get('/category/:slug', getCategoryBySlug);
router.put('/category/:slug', authMiddleware, checkAdmin, updateCategory);
router.delete('/category/:slug', authMiddleware, checkAdmin, deleteCategory);
router.patch('/category/:slug', authMiddleware, checkAdmin, restoreCategoryService);

export default router;