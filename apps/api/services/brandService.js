import slugify from "slugify";
import prisma from "../prisma/client.js";

export const createBrandService = async (data) => {
  const slug = slugify(data.name, { lower: true });
  if (
    await prisma.brand.findUnique({
      where: { slug },
    })
  ) {
    throw new Error("Brand already exists");
  }
  return await prisma.brand.create({
    data: { slug, ...data },
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
  const brand = await prisma.brand.findUnique({
    where: { slug },
  });
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
};

export const updateBrandService = async (slug, data) => {
  if (
    !(await prisma.brand.count({
      where: { slug },
    }))
  ) {
    throw new Error("Brand not found");
  }

  const newSlug = data.name ? slugify(data.name, { lower: true }) : undefined;

  const brand = prisma.brand.update({
    where: { slug },
    data: { ...data, slug: newSlug },
  });
  return brand;
};
