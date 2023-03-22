const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function seedUsers() {
    const hashedPassword = await bcrypt.hash('password', 10);
    const phuc = await prisma.user.upsert({
        where: { email: 'me@phuc.to' },
        update: {},
        create: {
            email: 'me@phuc.to',
            password: hashedPassword,
            username: 'phuc',
        },
    });
    console.log({ phuc });
}

async function main() {
    await seedUsers();
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
