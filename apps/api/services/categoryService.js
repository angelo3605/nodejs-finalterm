import prisma from "../prisma/prismaClient.js";
import createSlug from "../utils/slugify.js";

export const createCategoryService = async (name, desc, imageUrl) => {
    const slug = createSlug(name);

    const existingCategory = await prisma.category.findUnique({ where: { slug } });

    if (existingCategory) {
        throw new Error('Category already exists');
    }

    const category = await prisma.category.create({
        data: {
            name,
            slug,
            desc,
            imageUrl,
        },
    });

    return category;
}

export const getCategoriesService = async () => {
    const categories = await prisma.category.findMany({ where: { isDeleted: false } });

    return categories;
}

export const getCategoryServiceFromTrash = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { isDeleted: true },
            // select: { id: true, name: true, isDeleted: true }
        });
        res.json(categories); // Trả về danh sách các category đã bị xóa
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories from trash' });
    }
};

// à rồi địt, do không có controller nên nó auto load


export const getCategoryBySlugService = async (slug) => {
    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
        throw new Error("Category not found");
    }

    return category;
}

export const updateCategoryService = async (slug, name, desc, imageUrl) => {
    const updatedSlug = createSlug(name);

    const category = await prisma.category.update({
        where: { slug },
        data: {
            name,
            slug: updatedSlug,
            desc,
            imageUrl,
        },
    });

    return category;
};

export const deleteCategoryService = async (slug) => {
    const category = await prisma.category.update({
        where: { slug },
        data: { isDeleted: true },
    });

    return { message: 'Category deletd', category };
};

export const restoreCategoryService = async (slug) => {
    const category = await prisma.category.update({
        where: { slug },
        data: { isDeleted: false },
    });

    return { message: 'Category restore', category };
};