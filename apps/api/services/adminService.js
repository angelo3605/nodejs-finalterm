import prisma from "../prisma/prismaClient.js";

// Lấy tất cả người dùng
export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const blockUser = async (userId) => {
    try {
        const blockedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role: "BLOCKED",
            }
        });

        return blockedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: userData,
        });

        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};
