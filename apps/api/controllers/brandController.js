import { createBrandService, getBrandsService, getBrandBySlugService, updateBrandService, deleteBrandService, getBrandServiceFromTrash, restoreBrandService } from '../services/brandService.js';

export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await createBrandService(name);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error creating brand' });
  }
};

export const getBrands = async (req, res) => {
  try {
    const result = await getBrandsService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching brands' });
  }
};

export const getBrandsFromTrash = async (req, res) => {
  try {
    const result = await getBrandServiceFromTrash();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching brands' });
  }
};

export const getBrandBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await getBrandBySlugService(slug);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching brand by slug' });
  }
};

export const updateBrand = async (req, res) => {
  const { slug } = req.params;
  const { name } = req.body;
  try {
    const result = await updateBrandService(slug, name);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating brand' });
  }
};

export const deleteBrand = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await deleteBrandService(slug);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting brand' });
  }
};


export const restoreBrand = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await restoreBrandService(slug);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error restoring brand' });
  }
};
