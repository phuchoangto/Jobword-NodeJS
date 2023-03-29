const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role, JobType } = require('@prisma/client');
const upload = require('../config/upload');
const multer = require('../config/multer');
const ensureUserHasProfile = require('../middlewares/ensureUserHasProfile');
const isRole = require('../middlewares/isRole');
const paginate = require('../config/pagination');
const createJobSchema = require('../validation/createJobSchema');

module.exports = {
    index: [
        isRole(Role.EMPLOYER),
        ensureUserHasProfile,
        async (req, res, next) => {

            // get total number of records
            const totalRecords = await prisma.job.count( { where: { employer: { userId: req.user.id } } } );

            // if no records, render the page with empty data
            if (totalRecords === 0) {
                res.render('dashboard/manage-job', { title: 'Jobs', jobs: [], pagination: {} });
                return;
            }

            // get pagination info from query params
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const pagination = paginate(totalRecords, limit, page);

            // get jobs from database
            const jobs = await prisma.job.findMany({
                where: { employer: { userId: req.user.id } },
                include: { category: true },
                take: pagination.limit,
                skip: pagination.offset,
            });

            // render the page with data
            res.render('dashboard/manage-job', { title: 'Manage Jobs', jobs, pagination });
        }
    ],

    create: [
        isRole(Role.EMPLOYER),
        ensureUserHasProfile,
        async (req, res, next) => {
            const categories = await prisma.jobCategory.findMany();
            const provinces = await prisma.province.findMany();
            const today = new Date();
            res.render('dashboard/create-job', { title: 'Create Job', categories, provinces, today, JobType });
        }
    ],

    store: [
        isRole(Role.EMPLOYER),
        ensureUserHasProfile,
        async (req, res, next) => {
            const validation = createJobSchema.validate(req.body);

            if (validation.error) {
                res.status(400).json({ message: 'Validation error', error: validation.error });
                return;
            }

            const { categoryId, provinceId, experienceYears, deadline, ...value } = validation.value;

            const employer = await prisma.employer.findUnique({ where: { userId: req.user.id } });
            const job = await prisma.job.create({
                data: {
                    ...value,
                    experienceYears: parseInt(experienceYears),
                    deadline: new Date(deadline),
                    employer: { connect: { id: employer.id } },
                    province: { connect: { id: parseInt(provinceId) } },
                    category: { connect: { id: parseInt(categoryId) } },
                }
            });

            res.status(200).json({ message: 'Job created successfully', job });
        }
    ]
}