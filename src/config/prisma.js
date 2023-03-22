const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient({ log: ['error'] });
module.exports = prisma;