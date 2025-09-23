import prisma from "../prisma/prismaClient.js";

async function checkAdmin(req, res, next) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    req.user = user;
    next(); // Tiến hành qua bước tiếp theo
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
}

export default checkAdmin;
