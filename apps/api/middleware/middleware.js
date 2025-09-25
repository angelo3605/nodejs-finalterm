import jwt from "jsonwebtoken";

export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded; // gán thông tin user nếu token hợp lệ
      }
      // dù có lỗi hay không thì vẫn next, không trả lỗi Unauthorized
      next();
    });
  } else {
    // không có token, vẫn next để cho phép guest
    next();
  }
};
