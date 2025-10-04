import jwt from "jsonwebtoken";

export const extractUserId = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.sub;
    } catch (err) {
      console.warn("Invalid token in extractUserId middleware:", err.message);
      req.userId = null; // Gán null nếu token sai
    }
  } else {
    req.userId = null; // Không có token
  }

  next();
};
