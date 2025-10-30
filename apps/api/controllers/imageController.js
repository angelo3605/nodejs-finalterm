import { addImageService, deleteImageService, getAllImagesService, getImageByIdService, updateImageAltTextService } from "../services/imageService.js";

export const uploadImage = async (req, res) => {
  const images = await addImageService(req.files);
  return res.json({ images });
};

export const updateImage = async (req, res) => {
  const image = await updateImageAltTextService(req.params.id, req.body.altText);
  return res.json({ image });
};

export const deleteImage = async (req, res) => {
  const image = await deleteImageService(req.params.id);
  return res.json({ image });
};

export const getAllImages = async (req, res) => {
  const data = await getAllImagesService(req.pagination);
  return res.json(data);
};

export const getImageById = async (req, res) => {
  const image = await getImageByIdService(req.params.id);
  return res.json({ image });
};
