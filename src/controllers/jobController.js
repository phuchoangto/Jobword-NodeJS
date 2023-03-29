const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');
const upload = require('../config/upload');
const multer = require('../config/multer');
const paginate = require('express-paginate');
const ensureUserHasProfile = require('../middlewares/ensureUserHasProfile');
const isRole = require('../middlewares/isRole');
const paginate = require('../config/pagination');

module.exports = {
    index: [
        isRole(Role.EMPLOYER),
        ensureUserHasProfile,
        async (req, res, next) => {
            const totalRecords = await prisma.job.count( { where: { employer: { userId: req.user.id } } } );
            if (totalRecords === 0) {
                res.render('dashboard/job', { title: 'Jobs', jobs: [], pagination: {} });
                return;
            }
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const pagination = paginate(totalRecords, limit, page);
            const jobs = await prisma.job.findMany({
                where: { employer: { userId: req.user.id } },
                take: pagination.limit,
                skip: pagination.offset,
            });
            res.render('dashboard/job', { title: 'Jobs', jobs, pagination });
        }
    ],
}