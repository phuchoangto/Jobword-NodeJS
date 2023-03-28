const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');
const upload = require('../config/upload');
const multer = require('../config/multer');
const paginate = require('express-paginate');
const ensureUserHasProfile = require('../middlewares/ensureUserHasProfile');

module.exports = {
    index: [
        ensureUserHasProfile,
        async (req, res, next) => {
            const totalRecords = await prisma.cV.count({ where: { jobSeeker : { userId: req.user.id } } });
            if (totalRecords === 0) {
                res.render('dashboard/cv', {title: 'CV', cvs: [], pagination: {} });
                return;
            }
            let limit = parseInt(req.query.limit) || 10;
            if (limit > totalRecords) limit = totalRecords;
            const pageCount = Math.ceil(totalRecords / limit);
            let page = parseInt(req.query.page) || 1;
            if (page < 1) page = 1;
            if (page > pageCount) page = pageCount;
            let offset = (page - 1) * limit;
            const pagination = { page, limit, pageCount, totalRecords };
            const cvs = await prisma.cV.findMany({
                where: { jobSeeker : { userId: req.user.id } },
                take: limit,
                skip: offset,
            });
            res.render('dashboard/cv', {title: 'CV', cvs, pagination });
        }
    ],

    create: [
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
}