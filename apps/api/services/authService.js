import prisma from '../prisma/prismaClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



export const loginService = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        message: 'Login successful',
        token,
        customer: {
            fullname: user.fullName,
            email: user.email,
            loyaltyPoints: user.loyaltyPoints,
            role: user.role  // optional
        }
    };
};


export const registerService = async (email, password, fullName) => {
    const existngUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existngUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role: "CUSTOMER",
            loyaltyPoints: 0,
        }
    });

    //  thực hiện đăng nhập ngay khi đăng ký
    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        message: 'Registration successful',
        token,
        user: {
            fullName: newUser.fullName,
            email: newUser.email,
            loyaltyPoints: newUser.loyaltyPoints,
            role: newUser.role,
        }
    };
}
