import prisma from "../prisma/prismaClient.js";


export const lookUpInfo = async (mssv) => {
    const customer = await prisma.customer.findUnique({ where: { mssv } });

    if (!customer) throw new Error('Invalid customer');

    return {
        message: 'Find successful',
        customer: {
            mssv: customer.mssv,
            full_name: customer.full_name,
            tuition_total: customer.tuition_total,
            status: customer.status
        }
    };
};
