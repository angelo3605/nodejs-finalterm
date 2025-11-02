import prisma from "../prisma/client.js";

export const createVariantService = async (data) => {
  return prisma.productVariant.create({ data });
};

export const updateVariantService = async (id, data) => {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
};

export const getAllVariantsService = async ({ productSlug }, { page, pageSize }) => {
  const [total, data] = await Promise.all([
    prisma.variant.count({
      where: { productSlug },
    }),
    prisma.variant.findMany({
      where: { productSlug },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { data, total };
};

export const getVariantByIdService = async (id) => {
  return await prisma.productVariant.findUnique({
    where: { id },
  });
};
