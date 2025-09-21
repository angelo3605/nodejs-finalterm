import prisma from "../prisma/prismaClient.js";
import { getDiscountDetailsService } from "./discountCodeService.js";
import { updateLoyaltyPoints } from './userService.js';

// Thanh toán giỏ hàng của người dùng
export const checkoutService = async (userId, shippingInfo, discountCode) => {
    try {
        // Lấy giỏ hàng của người dùng
        const cart = await prisma.cart.findUnique({
            where: { userId: userId, status: 'ACTIVE' },
            include: {
                cartItems: {
                    include: { variant: true }
                }
            }
        });

        if (!cart || cart.cartItems.length === 0) {
            throw new Error('Giỏ hàng trống');
        }

        // Kiểm tra mã giảm giá
        const discount = discountCode ? await getDiscountDetailsService(discountCode) : null;

        // Tính tổng giá trị đơn hàng
        const totalAmount = cart.cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

        // Tính giá trị giảm giá từ mã giảm giá
        const discountAmount = discount ?
            (discount.type === 'PERCENTAGE' ? totalAmount * (discount.value / 100) : discount.value)
            : 0;

        // Tính tổng giá trị sau khi giảm giá
        let finalAmount = totalAmount - discountAmount;

        // Kiểm tra điểm loyalty của người dùng
        const user = await prisma.user.findUnique({ where: { id: userId } });
        let loyaltyPointsToUse = 0;
        if (user && user.loyaltyPoints > 0) {
            loyaltyPointsToUse = Math.min(user.loyaltyPoints, finalAmount);  // Giới hạn số điểm sử dụng
            finalAmount -= loyaltyPointsToUse;
        }

        // Tạo đơn hàng
        const order = await prisma.order.create({
            data: {
                sumAmount: totalAmount,
                totalAmount: finalAmount,
                status: 'PENDING',
                userId: userId,
                shippingAddress: shippingInfo,
                orderItems: {
                    create: cart.cartItems.map(item => ({
                        productName: item.variant.product.name,
                        variantName: item.variant.name,
                        quantity: item.quantity,
                        unitPrice: item.variant.price,
                        sumAmount: item.variant.price * item.quantity,
                        variantId: item.variant.id
                    }))
                }
            }
        });

        // Cập nhật trạng thái giỏ hàng thành "CHECKED_OUT"
        await prisma.cart.update({
            where: { userId: userId, status: 'ACTIVE' },
            data: { status: 'CHECKED_OUT' }
        });

        // Cập nhật điểm loyalty của người dùng (thêm điểm mới từ đơn hàng này)
        await updateLoyaltyPoints(userId, totalAmount);

        // Giảm số điểm loyalty đã sử dụng
        if (loyaltyPointsToUse > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: { loyaltyPoints: { decrement: loyaltyPointsToUse } }  // Giảm điểm sử dụng
            });
        }

        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const checkoutGuestService = async (shippingInfo, discountCode) => {
    try {
        const discount = discountCode ? await getDiscountDetailsService(discountCode) : null;

        // Giá tạm thời (giả sử giá trị đơn hàng là 100)
        const totalAmount = 100;  // Thay thế bằng giá trị thực tế
        const discountAmount = discount ?
            (discount.type === 'PERCENTAGE' ? totalAmount * (discount.value / 100) : discount.value)
            : 0;

        const finalAmount = totalAmount - discountAmount;

        // Tạo đơn hàng cho khách vãng lai
        const order = await prisma.order.create({
            data: {
                sumAmount: totalAmount,
                totalAmount: finalAmount,
                status: 'PENDING',
                shippingAddress: shippingInfo,
                orderItems: {
                    create: [{
                        productName: 'Sample Product',
                        variantName: 'Sample Variant',
                        quantity: 1,
                        unitPrice: 100,
                        sumAmount: finalAmount
                    }]
                }
            }
        });

        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: status,
            }
        });

        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Lấy danh sách đơn hàng
export const getAllOrders = async () => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: true,
                payments: true,
            }
        });

        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
};