import slugify from "slugify";
import prisma from "../prisma/client.js";

const productSelect = {
  id: true,
  slug: true,
  name: true,
  desc: true,
  imageUrls: true,
  createdAt: true,
  updatedAt: true,
  brand: { where: { isDeleted: false } },
  category: { where: { isDeleted: false } },
  variants: {
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      stockQuantity: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

export const createProductService = async ({ name, desc, imageUrls, brand, category }) => {
  const slug = slugify(name, { lower: true });
  if (
    await prisma.product.findUnique({
      where: { slug },
    })
  ) {
    throw new Error("Product already exists");
  }
  return await prisma.product.create({
    data: {
      slug,
      name,
      desc,
      imageUrls,
      brand: brand ? { connect: { slug: brand } } : undefined,
      category: category ? { connect: { slug: category } } : undefined,
    },
    select: productSelect,
  });
};

export const getAllProductsService = async (page = 1, pageSize = 10) => {
  const count = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { isDeleted: false },
    select: productSelect,
  });
  return { products, count };
};

export const getDeletedProductsService = async () => {
  return await prisma.product.findMany({
    where: { isDeleted: true },
    select: productSelect,
  });
};

export const getProductBySlugService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: productSelect,
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const updateProductService = async (slug, { name, desc, imageUrls, brand, category, isDeleted }) => {
  if (
    !(await prisma.product.count({
      where: { slug },
    }))
  ) {
    throw new Error("Product not found");
  }
  return await prisma.product.update({
    where: { slug },
    data: {
      slug: name ? slugify(name, { lower: true }) : undefined,
      name,
      desc,
      imageUrls,
      isDeleted,
      brand: brand ? { connect: { slug: brand } } : undefined,
      category: category ? { connect: { slug: category } } : undefined,
    },
    select: productSelect,
  });
};
