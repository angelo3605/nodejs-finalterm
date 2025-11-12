import slugify from "slugify";
import prisma from "../prisma/client.js";

const MAX_FEATURED = 5;

const productSelect = {
  id: true,
  slug: true,
  name: true,
  desc: true,
  imageUrls: true,
  createdAt: true,
  updatedAt: true,
  brand: true,
  category: true,
  isFeatured: true,
  tags: true,
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
  ratings: {
    select: {
      id: true,
      stars: true,
      review: true,
      user: {
        select: {
          fullName: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  },
  comments: {
    select: {
      id: true,
      senderName: true,
      message: true,
      createdAt: true,
      replies: {
        select: {
          id: true,
          senderName: true,
          message: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    where: {
      parent: null,
    },
    orderBy: { createdAt: "desc" },
  },
};

export const createProductService = async (data) => {
  if (
    data.isFeatured &&
    (await prisma.product.count({
      where: { isFeatured: true },
    })) > MAX_FEATURED
  ) {
    throw new Error(`Only ${MAX_FEATURED} featured products allowed`);
  }

  const slug = slugify(data.name, { lower: true });
  return prisma.product.create({
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

export const getAllProductsService = async (sorting, filtering, { page, pageSize }) => {
  const { sortBy, sortInAsc } = sorting;
  const { name, minPrice, maxPrice, category, brands, isFeatured, tags } = filtering;

  const priceFilter =
    minPrice || maxPrice
      ? {
          OR: [
            {
              variants: {
                some: {
                  price: {
                    gte: minPrice ?? 0,
                    lte: maxPrice ?? Number.MAX_SAFE_INTEGER,
                  },
                },
              },
            },
            {
              variants: {
                none: {},
              },
            },
          ],
        }
      : {};

  const where = {
    isFeatured: isFeatured || undefined,
    isDeleted: false,
    name: name
      ? {
          contains: name,
          mode: "insensitive",
        }
      : undefined,
    ...priceFilter,
    brand: brands?.length
      ? {
          slug: { in: brands },
        }
      : undefined,
    category: category
      ? {
          slug: category,
        }
      : undefined,
    tags: tags
      ? {
          hasSome: tags,
        }
      : undefined,
  };

  const sortOrder = sortInAsc ? "asc" : "desc";

  let orderBy = { createdAt: "desc" };
  if (sortBy && !["mostOrders", "price"].includes(sortBy)) {
    orderBy = { [sortBy]: sortOrder };
  }

  const [total, data, tagsRaw] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      select: productSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
    }),
    prisma.product.findMany({
      select: { tags: true },
    }),
  ]);

  const allTags = [...new Set(tagsRaw.flatMap((product) => product.tags))];

  if (sortBy === "mostOrders") {
    const orderCounts = await prisma.orderItem.groupBy({
      by: ["productSlug"],
      _sum: { quantity: true },
    });
    data.sort((a, b) => {
      const getSumQuantity = (slug) => orderCounts.find((item) => item.productSlug === slug)?._sum.quantity ?? 0;
      const _a = getSumQuantity(a.slug);
      const _b = getSumQuantity(b.slug);
      return sortInAsc ? _b - _a : _a - _b;
    });
  } else if (sortBy === "price") {
    data.sort((a, b) => {
      const getMinPrice = (product) => (product.variants.length ? Math.min(...product.variants.map((variant) => variant.price)) : 0);
      const minA = getMinPrice(a);
      const minB = getMinPrice(b);
      return sortInAsc ? minB - minA : minA - minB;
    });
  }

  return { data, total, tags: allTags };
};

export const getDeletedProductsService = async () => {
  return prisma.product.findMany({
    where: { isDeleted: true },
    select: productSelect,
  });
};

export const getProductBySlugService = async (slug) => {
  return prisma.product.findUnique({
    where: { slug },
    select: productSelect,
  });
};

export const updateProductService = async (slug, data) => {
  if (
    data.isFeatured &&
    (await prisma.product.count({
      where: {
        isFeatured: true,
        NOT: { slug },
      },
    })) > MAX_FEATURED
  ) {
    throw new Error(`Only ${MAX_FEATURED} featured products allowed`);
  }

  const newSlug = data.name ? slugify(data.name, { lower: true }) : undefined;
  return prisma.product.update({
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
