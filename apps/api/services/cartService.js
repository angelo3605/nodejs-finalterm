import prisma from "../prisma/prismaClient.js";

export const addToCartService = async (userId, productId, variantId, quantity) => {
    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: userId, status: 'ACTIVE' },
            include: { cartItems: true }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: userId, sumAmount: 0, status: 'ACTIVE' }
            });
        }

        const existingCartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, variantId: variantId }
        });

        if (existingCartItem) {
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            });
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, variantId: variantId, quantity }
            });
        }

        return await getCartSummaryService(userId);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateCartService = async (userId, cartItemId, quantity) => {
    try {
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });

        return await getCartSummaryService(userId);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const removeFromCartService = async (userId, cartItemId) => {
    try {
        await prisma.cartItem.delete({
            where: { id: cartItemId }
        });

        return await getCartSummaryService(userId); // Tóm tắt giỏ hàng sau khi xóa
    } catch (error) {
        throw new Error(error.message);
    }
};

// Tóm tắt giỏ hàng
export const getCartSummaryService = async (userId) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: userId, status: 'ACTIVE' },
            include: {
                cartItems: {
                    include: { variant: { include: { product: true } } }
                }
            }
        });

        if (!cart) {
            throw new Error('Giỏ hàng không tồn tại');
        }

        let totalAmount = 0;
        const items = cart.cartItems.map(item => {
            const itemAmount = item.variant.price * item.quantity;
            totalAmount += itemAmount;
            return {
                productName: item.variant.product.name,
                variantName: item.variant.name,
                quantity: item.quantity,
                price: item.variant.price,
                totalAmount: itemAmount
            };
        });

        return {
            items,
            totalAmount
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
