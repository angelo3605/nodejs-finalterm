import { createCategoryService, getCategoriesService, getCategoryBySlugService, updateCategoryService, deleteCategoryService, getCategoryServiceFromTrash, restoreCategoryService } from '../services/categoryService.js';

export const createCategory = async (req, res) => {
  try {
    const { name, desc, imageUrl } = req.body;
    const result = await createCategoryService(name, desc, imageUrl);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error creating category' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const result = await getCategoriesService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching categories' });
  }
};

export const getCategoriesFromTrash = async (req, res) => {
  try {
    const result = await getCategoryServiceFromTrash();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching categories' });
  }
};

export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await getCategoryBySlugService(slug);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching category by slug' });
  }
};

export const updateCategory = async (req, res) => {
  const { slug } = req.params;
  const { name, desc, imageUrl } = req.body;
  try {
    const result = await updateCategoryService(slug, name, desc, imageUrl);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating category' });
  }
};

export const deleteCategory = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await CategoryService(slug);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting category' });
  }
};

export const restoreCategory = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await restoreCategoryService(slug);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error restoring category' });
  }
};
