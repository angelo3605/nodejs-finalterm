import { createProductService, getAllProductsService, getProductBySlugService, updateProductService } from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  const { products, count } = await getAllProductsService();
  return res.json({ products, count });
};

export const getProductBySlug = async (req, res) => {
  const product = await getProductBySlugService(req.params.slug);
  return res.json({ product });
};

export const createProduct = async (req, res) => {
  const product = await createProductService(req.body);
  return res.json({ product });
};

export const updateProduct = async (req, res) => {
  const { isDeleted, ...data } = req.body;
  const product = await updateProductService(req.params.slug, data);
  return res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const product = await updateProductService(req.params.slug, { isDeleted: true });
  return res.json({ product });
};

export const restoreProduct = async (req, res) => {
  const product = await updateProductService(req.params.slug, { isDeleted: false });
  return res.json({ product });
};
