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

            // get total number of records
            const totalRecords = await prisma.job.count( { where: { employer: { userId: req.user.id } } } );

            // if no records, render the page with empty data
            if (totalRecords === 0) {
                res.render('dashboard/job', { title: 'Jobs', jobs: [], pagination: {} });
                return;
            }

            // get pagination info from query params
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const pagination = paginate(totalRecords, limit, page);

            // get jobs from database
            const jobs = await prisma.job.findMany({
                where: { employer: { userId: req.user.id } },
                take: pagination.limit,
                skip: pagination.offset,
            });

            // render the page with data
            res.render('dashboard/manage-job', { title: 'Manage Jobs', jobs, pagination });
        }
    ],
}