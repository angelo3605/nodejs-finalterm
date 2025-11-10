import prisma from "../prisma/client.js";

export function checkRole(role) {
  return async (req, res, next) => {
    const id = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== role) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    next();
  };
}

export function restrictRoute(req, res, next) {
  if (req.user?.id && req.user?.role === "BLOCKED") {
    return res.status(403).json({
      message: "You have been blocked",
    });
  }
  next();
}
