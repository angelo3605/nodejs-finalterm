import slugify from "slugify";
import prisma from "../prisma/client.js";

export const createCategoryService = async (data) => {
  const slug = slugify(data.name, { lower: true });
  if (
    await prisma.category.findUnique({
      where: { slug },
    })
  ) {
    throw new Error("Category already exists");
  }
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
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

export const updateCategoryService = async (slug, data) => {
  if (
    !(await prisma.category.count({
      where: { slug },
    }))
  ) {
    throw new Error("Category not found");
  }

  const newSlug = data.name ? slugify(data.name, { lower: true }) : undefined;

  const category = prisma.category.update({
    where: { slug },
    data: { ...data, slug: newSlug },
  });
  return category;
};
