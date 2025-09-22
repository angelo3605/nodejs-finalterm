import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import checkAdmin from '../middleware/adminMiddleware.js';
import { createBrand, deleteBrand, getBrandBySlug, getBrands, updateBrand } from '../controllers/brandController.js';
import { getBrandServiceFromTrash, restoreBrandService } from '../services/brandService.js';
const brandRouter = express.Router();


brandRouter.post('/', authMiddleware, checkAdmin, createBrand);
brandRouter.get('/', getBrands);
// brandRouter.get('/trash', authMiddleware, checkAdmin, getBrandServiceFromTrash);

brandRouter.get('/:slug', getBrandBySlug);
brandRouter.put('/:slug', authMiddleware, checkAdmin, updateBrand);
brandRouter.delete('/:slug', authMiddleware, checkAdmin, deleteBrand);
// brandRouter.patch('/:slug/restore', authMiddleware, checkAdmin, restoreBrandService);


export default brandRouter;