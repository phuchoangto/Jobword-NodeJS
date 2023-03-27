const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function seedProvinces() {
    //https://provinces.open-api.vn/api/
    const response = await fetch('https://provinces.open-api.vn/api/');
    const provinces = await response.json();
    // remove "Tỉnh" or "Thành phố" from name
    const data = provinces.map(province => {
        return {
            name: province.name.replace(/(Tỉnh|Thành phố)/, '').trim(),
            code: province.code
        }
    });
    for (const province of data) {
        await prisma.province.upsert({
            where: { id: province.code },
            update: {
                name: province.name
            },
            create: {
                name: province.name,
                id: province.code
            }
        });
    }
}

async function seedSkills() {
    const skills = [
        { name: 'HTML' },
        { name: 'CSS' },
        { name: 'JavaScript' },
        { name: 'PHP' },
        { name: 'Python' },
        { name: 'Ruby' },
        { name: 'Java' },
        { name: 'C++' },
        { name: 'C#' },
        { name: 'C' },
        { name: 'Go' },
        { name: 'Rust' },
        { name: 'Swift' },
        { name: 'Kotlin' },
        { name: 'Objective-C' },
        { name: 'SQL' },
        { name: 'NoSQL' },
        { name: 'Git' },
        { name: 'Linux' },
        { name: 'Windows' },
        { name: 'MacOS' },
        { name: 'Docker' },
        { name: 'Kubernetes' },
        { name: 'AWS' },
        { name: 'GCP' },
        { name: 'Azure' },
        { name: 'Firebase' },
        { name: 'Heroku' },
        { name: 'Netlify' },
        { name: 'Vercel' },
        { name: 'DigitalOcean' },
        { name: 'Linode' },
        { name: 'Vultr' },
        { name: 'Terraform' },
        { name: 'Ansible' },
        { name: 'Puppet' },
        { name: 'Chef' },
        { name: 'Jenkins' },
        { name: 'CircleCI' },
        { name: 'TravisCI' },
        { name: 'Github Actions' },
        { name: 'Gitlab CI' },
        { name: 'Bitbucket Pipelines' },
        { name: 'Vue.js' },
        { name: 'React.js' },
        { name: 'Angular' },
        { name: 'Node.js' },
        { name: 'Express.js' },
        { name: 'Laravel' },
        { name: 'Django' },
        { name: 'Ruby on Rails' },
        { name: 'Spring' },
        { name: 'Flask' },
        { name: 'ASP.NET' },
        { name: 'ASP.NET Core' },
        { name: 'Next.js' },
    ];

    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { name: skill.name },
            update: {},
            create: skill,
        });
    }
}

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
}

async function main() {
    await seedProvinces();
    await seedUsers();
    await seedSkills();
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
