import slugify from "slugify";
import prisma from "../prisma/client.js";

export const createCategoryService = async (data) => {
  const slug = slugify(data.name, { lower: true });
  return await prisma.category.create({
    data: { slug, ...data },
  });
};

export const getAllCategoriesService = async () => {
  return await prisma.category.findMany({
    where: { isDeleted: false },
  });
};

export const getDeletedCategoriesService = async () => {
  return await prisma.category.findMany({
    where: { isDeleted: true },
  });
};

export const getCategoryBySlugService = async (slug) => {
  return await prisma.category.findUnique({
    where: { slug },
  });
};

export const updateCategoryService = async (slug, data) => {
  const newSlug = data.name ? slugify(data.name, { lower: true }) : undefined;
  return await prisma.category.update({
    where: { slug },
    data: {
      ...data,
      slug: newSlug,
    },
  });
};
