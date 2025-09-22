import prisma from '../prisma/prismaClient.js';
import createSlug from '../utils/slugify.js';

export const createBrandService = async (name) => {
    const slug = createSlug(name);

    const existngBrand = await prisma.brand.findUnique({ where: { slug } });

    if (existngBrand) {
        throw new Error('Brand already exists');
    }

    const brand = await prisma.brand.create({
        data: {
            name,
            slug,
        },
    });

    return brand
};

export const getBrandsService = async () => {
    const brands = await prisma.brand.findMany({ where: { isDeleted: false } });
    return brands
}

export const getBrandServiceFromTrash = async () => {
    const brands = await prisma.brand.findMany({ where: { isDeleted: true } });
    return brands
}

export const getBrandBySlugService = async (slug) => {
    const brand = await prisma.brand.findUnique({ where: { slug } });;

    if (!brand) {
        throw new Error("Brand not found!");
    }

    return brand;
}

export const updateBrandService = async (slug, name) => {
    const updatedSlug = createSlug(name);

    const brand = await prisma.brand.update({
        where: { slug },
        data: {
            name,
            slug: updatedSlug,
        },
    });

    return brand;
};

export const deleteBrandService = async (slug) => {
    const brand = await prisma.brand.update({
        where: { slug },
        data: { isDeleted: true },
    });

    return { message: "Brand delted", brand }
}

//  restore bị ngáo
export const restoreBrandService = async (slug) => {
    const brand = await prisma.brand.update({
        // where: { slug, isDeleted: true },
        // data: { isDeleted: false },
    });
    console.log(brand);

    return { message: "Brand restore", brand }
}