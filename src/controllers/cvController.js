const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');
const upload = require('../config/upload');
const multer = require('../config/multer');
const ensureUserHasProfile = require('../middlewares/ensureUserHasProfile');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const isRole = require('../middlewares/isRole');
const paginate = require('../config/pagination');

module.exports = {
    index: [
        isRole(Role.JOB_SEEKER),
        ensureUserHasProfile,
        async (req, res, next) => {
            const totalRecords = await prisma.cV.count({ where: { jobSeeker : { userId: req.user.id } } });
            if (totalRecords === 0) {
                res.render('dashboard/cv', {title: 'CV', cvs: [], pagination: {} });
                return;
            }
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const pagination = paginate(totalRecords, limit, page);
            const cvs = await prisma.cV.findMany({
                where: { jobSeeker : { userId: req.user.id } },
                take: pagination.limit,
                skip: pagination.offset,
            });
            res.render('dashboard/cv', {title: 'CV', cvs, pagination });
        }
    ],

    create: [
        isRole(Role.JOB_SEEKER),
        ensureUserHasProfile,
        multer.single('cv'),
        async (req, res, next) => {
            const { title } = req.body;

            if (req.file) {
                // Upload the profile picture to S3
                try {
                    const fileName = `${Date.now()}-${req.file.originalname}`;
                    const uploadResult = await upload(`cv/${fileName}`, req.file.buffer);
                    const jobSeeker = await prisma.jobSeeker.findUnique({ where: { userId: req.user.id } });
                    const cv = await prisma.cV.create({
                        data: {
                            title,
                            content: uploadResult.Location,
                            jobSeekerId: jobSeeker.id,
                        }
                    });
                    res.status(200).json({ message: 'CV uploaded successfully', cv });
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error uploading CV', error: err });
                }
            } else {
                res.status(400).json({ message: 'No CV file provided' });
            }
        }
    ],

    delete: [
        isRole(Role.JOB_SEEKER),
        ensureUserHasProfile,
        async (req, res, next) => {
            const { id } = req.params;
            try {
                const cv = await prisma.cV.delete({ where: { id: parseInt(id) } });
                res.status(200).json({ message: 'CV deleted successfully', cv });
            } catch (err) {
                console.log(err);
                res.status(500).json({ message: 'Error deleting CV', error: err });
            }
        }
    ],

    getAll: [
        ensureAuthenticated,
        isRole(Role.JOB_SEEKER),
        async (req, res, next) => {
            const cvs = await prisma.cV.findMany({
                where: { jobSeeker : { userId: req.user.id } },
            });
            res.status(200).json({ cvs });
        }
    ],
}