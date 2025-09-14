import prisma from '../prisma/prismaClient.js';
import jwt from 'jsonwebtoken';

export const loginService = async (username, password) => {
    const customer = await prisma.customer.findUnique({
        where: { username }
    });

    if (!customer || customer.password !== password) {
        throw new Error('Invalid username or password');
    }

    const token = jwt.sign(
        { mssv: customer.mssv, username: customer.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        message: 'Login successful',
        token,
        customer: {
            full_name: customer.full_name,
            phone: customer.phone,
            email: customer.email,
            balance: customer.balance,
            mssv: customer.mssv  // optional
        }
    };
};
