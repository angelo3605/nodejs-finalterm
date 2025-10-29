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
  comments: {
    select: {
      senderName: true,
      message: true,
      createdAt: true,
    },
  },
};

export const createProductService = async (data) => {
  const slug = slugify(data.name, { lower: true });
  return await prisma.product.create({
    data: {
      ...data,
      slug,
      brand: data.brand
        ? {
            connect: { slug: data.brand },
          }
        : undefined,
      category: data.category
        ? {
            connect: { slug: data.category },
          }
        : undefined,
    },
    select: productSelect,
  });
};

export const getAllProductsService = async ({ page, pageSize }) => {
  const [data, total] = await Promise.all([
    prisma.product.count({
      where: { isDeleted: false },
    }),
    prisma.product.findMany({
      where: { isDeleted: false },
      select: productSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { data, total };
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
  return product;
};

export const updateProductService = async (slug, data) => {
  const newSlug = data.name ? slugify(data.name, { lower: true }) : undefined;
  return await prisma.product.update({
    where: { slug },
    data: {
      ...data,
      slug: newSlug,
      brand: data.brand
        ? {
            connect: { slug: data.brand },
          }
        : undefined,
      category: data.category
        ? {
            connect: { slug: data.category },
          }
        : undefined,
    },
    select: productSelect,
  });
};
