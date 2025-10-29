import slugify from "slugify";
import prisma from "../prisma/client.js";

export const createBrandService = async (data) => {
  const slug = slugify(data.name, { lower: true });
  return await prisma.brand.create({
    data: { ...data, slug },
  });
};

export const getAllBrandsService = async () => {
  return await prisma.brand.findMany({
    where: { isDeleted: false },
  });
};

export const getDeletedBrandsService = async () => {
  return await prisma.brand.findMany({
    where: { isDeleted: true },
  });
};

export const getBrandBySlugService = async (slug) => {
  return await prisma.brand.findUnique({
    where: { slug },
  });
};

export const updateBrandService = async (slug, data) => {
  const newSlug = data.name ? slugify(data.name, { lower: true }) : undefined;
  return await prisma.brand.update({
    where: { slug },
    data: {
      ...data,
      slug: newSlug,
    },
  });
};
