import { createCategoryService, getAllCategoriesService, getCategoryBySlugService, updateCategoryService } from "../services/categoryService.js";

export const getAllCategories = async (req, res) => {
  const categories = await getAllCategoriesService();
  return res.json({
    data: categories,
  });
};

export const getCategoryBySlug = async (req, res) => {
  const category = await getCategoryBySlugService(req.params.slug);
  return res.json({
    data: category,
  });
};

export const createCategory = async (req, res) => {
  const category = await createCategoryService(req.body);
  return res.json({
    data: category,
  });
};

export const updateCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.slug, req.body);
  return res.json({
    data: category,
  });
};

export const deleteCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.slug, {
    isDeleted: true,
  });
  return res.json({
    data: category,
  });
};

export const restoreCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.slug, {
    isDeleted: false,
  });
  return res.json({
    data: category,
  });
};
