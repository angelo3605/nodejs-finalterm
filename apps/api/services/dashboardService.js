import prisma from "../prisma/prismaClient.js";

export const getDashboardStats = async () => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();
        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            }
        });

        const bestSellingProducts = await prisma.orderItem.groupBy({
            by: ['variantId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                }
            },
            take: 5,
            include: {
                variant: {
                    select: {
                        product: {
                            select: {
                                name: true,
                            }
                        },
                        name: true,
                    }
                }
            }
        });

        return {
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            bestSellingProducts,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAdvancedDashboardStats = async (startDate, endDate) => {
    try {
        // Tổng số đơn hàng trong khoảng thời gian
        const totalOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        });

        // Tổng doanh thu trong khoảng thời gian
        const totalRevenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            _sum: {
                totalAmount: true,
            }
        });

        // Các sản phẩm bán chạy nhất trong khoảng thời gian
        const bestSellingProducts = await prisma.orderItem.groupBy({
            by: ['variantId'],
            _sum: {
                quantity: true,
            },
            where: {
                order: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                }
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                }
            },
            take: 5,
            include: {
                variant: {
                    select: {
                        product: {
                            select: {
                                name: true,
                            }
                        },
                        name: true,
                    }
                }
            }
        });

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            bestSellingProducts,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};