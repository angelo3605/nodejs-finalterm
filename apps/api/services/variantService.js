import prisma from "../prisma/client.js";

export const createVariantService = async (productSlug, { name, price, stockQuantity }) => {
  if (
    !(await prisma.product.findUnique({
      where: { slug: productSlug },
    }))
  ) {
    throw new Error("Product not found");
  }
  const variant = await prisma.productVariant.create({
    data: { name, price, stockQuantity, product: { connect: { slug: productSlug } } },
  });
  return variant;
};

export const updateVariantService = async (id, { name, price, stockQuantity, isDeleted }) => {
  return await prisma.productVariant.update({
    where: { id },
    data: { name, price, stockQuantity, isDeleted },
  });
};

export const getAllVariantsService = async (page = 1, pageSize = 10) => {
  const count = await prisma.image.count();
  const variants = await prisma.productVariant.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { variants, count };
};

export const getVariantByIdService = async (id) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id },
  });
  if (!variant) {
    throw new Error("Variant not found");
  }
  return variant;
};
