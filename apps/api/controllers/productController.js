import { productFilteringSchema, productSortingSchema } from "@mint-boutique/zod-schemas";
import { createProductService, getAllProductsService, getProductBySlugService, updateProductService } from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  const sorting = productSortingSchema.parse(req.query);
  const filtering = productFilteringSchema.parse(req.query);

  const data = await getAllProductsService(sorting, filtering, req.pagination);
  return res.json(data);
};

export const getProductBySlug = async (req, res) => {
  const product = await getProductBySlugService(req.params.slug);
  return res.json({
    data: product,
  });
};

export const createProduct = async (req, res) => {
  const product = await createProductService(req.body);
  return res.json({
    data: product,
  });
};

export const updateProduct = async (req, res) => {
  const product = await updateProductService(req.params.slug, req.body);
  return res.json({
    data: product,
  });
};

export const deleteProduct = async (req, res) => {
  const product = await updateProductService(req.params.slug, {
    isDeleted: true,
  });
  return res.json({
    data: product,
  });
};

export const restoreProduct = async (req, res) => {
  const product = await updateProductService(req.params.slug, {
    isDeleted: false,
  });
  return res.json({
    data: product,
  });
};
