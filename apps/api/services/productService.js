import prisma from "../prisma/prismaClient.js";
import createSlug from "../utils/slugify.js";

// Thêm sản phẩm
export const addProductService = async (productData) => {
  try {
    const { name, desc, categoryId, brandId, variants, images } = productData;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: createSlug(name),
        desc,
        categoryId,
        brandId,
        variants: variants.length ? { create: variants } : undefined, // Tạo variants nếu có
        images: images.length ? { create: images } : undefined,
      },
    });

    return newProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

// nếu được làm get from trash

export const updateProductService = async (slug, name, desc, categoryId, brandId, variants, images) => {
  const updatedSlug = createSlug(name);

  try {
    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: {
        slug: updatedSlug,
        name,
        desc,
        category: categoryId ? { connect: { id: categoryId } } : undefined, // Nếu có categoryId, connect với category
        brand: brandId ? { connect: { id: brandId } } : undefined, // Nếu có brandId, connect với brand
        variants:
          variants && variants.length
            ? {
                update: variants.map((variant) => ({
                  where: { id: variant.id },
                  data: {
                    name: variant.name,
                    price: variant.price,
                    stockQuantity: variant.stockQuantity,
                  },
                })),
              }
            : undefined,
        images:
          images && images.length
            ? {
                update: images.map((image) => ({
                  where: { id: image.id },
                  data: {
                    url: image.url,
                    filePath: image.filePath,
                    altText: image.altText,
                  },
                })),
              }
            : undefined,
      },
    });

    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Xóa sản phẩm
export const deleteProductService = async (slug) => {
  try {
    const deletedProduct = await prisma.product.update({
      where: { slug },
      data: {
        isDeleted: true,
      },
    });

    return deletedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const restoreProductService = async (slug) => {
  try {
    const deletedProduct = await prisma.product.update({
      where: { slug },
      data: {
        isDeleted: false,
      },
    });

    return deletedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getFilteredProductsService = async (filters, page, pageSize) => {
  const { search, brandIds, categoryIds, minPrice, maxPrice, startDate, endDate } = filters;

  const where = {
    isDeleted: false,
  };

  // Tìm theo tên hoặc mô tả
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { desc: { contains: search, mode: "insensitive" } },
    ];
  }

  if (brandIds?.length > 0) {
    where.brandId = { in: brandIds };
  }

  if (categoryIds?.length > 0) {
    where.categoryId = { in: categoryIds };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }
  
  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalCount / pageSize);
  const skip = (page - 1) * pageSize;

  const products = await prisma.product.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      desc: true,
      brand: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
        },
      },
    },
  });

  const filteredProducts = products.map((product) => {
    const filteredVariants = product.variants.filter((variant) => {
      return (
        (minPrice === undefined || variant.price >= minPrice) &&
        (maxPrice === undefined || variant.price <= maxPrice)
      );
    });

    return {
      ...product,
      variants: filteredVariants, 
    };
  });

  return { products: filteredProducts, totalCount, totalPages };
};



export const getTopProductService = async (number = 5) => {
  const currentDate = new Date();

  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); 

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productName"], 
    _sum: { quantity: true },
    orderBy: {
      _sum: { quantity: "desc" },
    },
    where: {
      createdAt: {
        gte: startDate, 
        lte: endDate,   
      },
    },
    take: number,
  });

  return topProducts;
};
