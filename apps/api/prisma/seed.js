// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Tạo User ví dụ
    await prisma.user.create({
        data: {
            fullName: 'Nguyen Van A',
            email: 'nguyenvana@example.com',
            password: '123456',
            role: 'customer',
        },
    })

    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
