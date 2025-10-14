import slugify from "slugify";
import prisma from "../prisma/client.js";

export const createProductService = async (data) => {
  const slug = slugify(data.name, { lower: true });
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
      ...data,
      brand: data.brand ? { connect: { slug: data.brand } } : undefined,
      category: data.category ? { connect: { slug: data.category } } : undefined,
      variants: data.variants.length ? { create: data.variants } : undefined,
    },
    include: {
      brand: { where: { isDeleted: false } },
      category: { where: { isDeleted: false } },
      variants: { where: { isDeleted: false } },
    },
  });
};

export const getAllProductsService = async (page = 1, pageSize = 10) => {
  const count = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { isDeleted: false },
    include: {
      brand: { where: { isDeleted: false } },
      category: { where: { isDeleted: false } },
      variants: { where: { isDeleted: false } },
    },
  });
  return { products, count };
};

export const getDeletedProductsService = async () => {
  return await prisma.product.findMany({
    where: { isDeleted: true },
    include: {
      brand: { where: { isDeleted: false } },
      category: { where: { isDeleted: false } },
      variants: { where: { isDeleted: false } },
    },
  });
};

export const getProductBySlugService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: { where: { isDeleted: false } },
      category: { where: { isDeleted: false } },
      variants: { where: { isDeleted: false } },
    },
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const updateProductService = async (slug, data) => {
  if (
    !(await prisma.product.count({
      where: { slug },
    }))
  ) {
    throw new Error("Product not found");
  }
  const product = prisma.product.update({
    where: { slug },
    data: {
      ...data,
      slug: data.name ? slugify(data.name, { lower: true }) : undefined,
      brand: data.brand ? { connect: { slug: data.brand } } : undefined,
      category: data.category ? { connect: { slug: data.category } } : undefined,
      variants: data.variants.length ? { deleteMany: {}, create: data.variants } : undefined,
    },
    include: {
      brand: { where: { isDeleted: false } },
      category: { where: { isDeleted: false } },
      variants: { where: { isDeleted: false } },
    },
  });
  return product;
};
