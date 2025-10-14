import path from "path";

import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const storage = multer.diskStorage({
  destination: path.resolve("public/uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5_000_000 },
});
