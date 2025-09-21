import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import checkAdmin from '../middleware/adminMiddleware.js';
import { createBrand, deleteBrand, getBrandBySlug, getBrands, updateBrand } from '../controllers/brandController.js';
import { getBrandServiceFromTrash, restoreBrandService } from '../services/brandService.js';
const router = express.Router();


router.post('/brand', authMiddleware, checkAdmin, createBrand);
router.get('/brands', getBrands);
router.get('/categories-trash', authMiddleware, checkAdmin, getBrandServiceFromTrash);
router.get('/brand/:slug', getBrandBySlug);
router.put('/brand/:slug', authMiddleware, checkAdmin, updateBrand);
router.delete('/brand/:slug', authMiddleware, checkAdmin, deleteBrand);
router.patch('/brand/:slug', authMiddleware, checkAdmin, restoreBrandService);


export default router;