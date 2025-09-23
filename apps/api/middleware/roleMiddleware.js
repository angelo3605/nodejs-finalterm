import prisma from "../prisma/prismaClient";

export function checkRole(role) {
    return async (req, res, next) => {
        const id = req.user?.id;
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user || user.role !== role) {
            return next(new Error('Permission denied'));
        }
        next();
    }
}