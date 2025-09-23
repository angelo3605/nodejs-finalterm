import bcrypt from 'bcryptjs';
import prisma from '../prisma/prismaClient.js';
import jwt from 'jsonwebtoken';

export const registerService = async (email, password, fullName) => {
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error('Email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { email, password: hashedPassword, fullName },
  });
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No token provided');
  }

  const { sub } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await prisma.user.findUnique({ where: { id: sub } });
  if (!user) {
    throw new Error('Invalid token');
  }

  return user;
};
