import fs from "fs";
import path from "path";
import prisma from "../prisma/client.js";

export const addImageService = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const uploadDir = path.resolve("public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

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

  const updated = await prisma.image.update({
    where: { id: newImage.id },
    data: { url: imageUrl },
  });

  return updated;
};

export const updateImageAltTextService = async (id, altText) => {
  const updatedImage = await prisma.image.update({
    where: { id },
    data: { altText },
  });
  if (!updatedImage) {
    throw new Error("Cannot find image");
  }
  return updatedImage;
};

export const deleteImageService = async (id) => {
  const image = await prisma.image.findUnique({
    where: { id },
  });
  if (!image) {
    throw new Error("Cannot find image");
  }

  const uploadDir = path.resolve("public/uploads");
  const filepath = path.join(uploadDir, `${id}${path.extname(image.url)}`);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  await prisma.image.delete({ where: { id } });

  return image;
};

export const getAllImagesService = async (page = 1, pageSize = 10) => {
  const count = await prisma.image.count();
  const images = await prisma.image.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { images, count };
};

export const getImageByIdService = async (id) => {
  const image = await prisma.image.findUnique({
    where: { id },
  });
  if (!image) {
    throw new Error("Cannot find image");
  }
  return image;
};
