import fs from "fs";
import path from "path";
import prisma from "../prisma/client.js";

export const addImageService = async (files) => {
  if (!files || !files.length === 0) {
    throw new Error("No images uploaded");
  }

  const uploadDir = path.resolve("public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const images = await Promise.all(
    files.map(async (file) => {
      const newImage = await prisma.image.create({
        data: {
          url: "",
          altText: null,
        },
      });

      const filename = `${newImage.id}${path.extname(file.originalname)}`;
      const targetPath = path.join(uploadDir, filename);

      fs.renameSync(file.path, targetPath);

      const imageUrl = `/uploads/${filename}`;

      return await prisma.image.update({
        where: { id: newImage.id },
        data: { url: imageUrl },
      });
    }),
  );

  return images;
};

export const updateImageAltTextService = async (id, altText) => {
  return await prisma.image.update({
    where: { id },
    data: { altText },
  });
};

export const deleteImageService = async (id) => {
  const image = await prisma.image.findUnique({
    where: { id },
  });

  const uploadDir = path.resolve("public/uploads");
  const filepath = path.join(uploadDir, `${id}${path.extname(image.url)}`);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  return await prisma.image.delete({
    where: { id },
  });
};

export const getAllImagesService = async ({ page, pageSize }) => {
  const [total, data] = await Promise.all([
    prisma.image.count(),
    prisma.image.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { data, total };
};

export const getImageByIdService = async (id) => {
  return await prisma.image.findUnique({
    where: { id },
  });
};
