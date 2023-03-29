const prisma = require('../config/prisma');
const { Role } = require('@prisma/client');
const ensureUserHasProfile = require('../middlewares/ensureUserHasProfile');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const isRole = require('../middlewares/isRole');
const paginate = require('../config/pagination');
const createJobSchema = require('../validation/createJobSchema');

module.exports = {
    apply: [
        ensureAuthenticated,
        isRole(Role.JOB_SEEKER),
        async (req, res, next) => {
            // check job valid
            const job = await prisma.job.findUnique({
                where: { id: parseInt(req.params.id) },
            });

            if (!job) {
                res.status(404).json({ message: 'Job not found' });
                return;
            }

            // check cv permission
            const cv = await prisma.cV.findUnique({
                where: { id: parseInt(req.body.cvId) },
                include: { jobSeeker: true }
            })

            if (!cv || cv.jobSeeker.userId !== req.user.id) {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }

            // check if already applied
            const jobApplication = await prisma.jobApplication.findFirst({
                where: {
                    jobId: job.id,
                    cvId: cv.id
                }
            });

            if (jobApplication) {
                res.status(400).json({ message: 'Already applied' });
                return;
            }

            // create job application
            const newJobApplication = await prisma.jobApplication.create({
                data: {
                    jobId: job.id,
                    cvId: cv.id,
                }
            });

            res.status(201).json({ message: 'Applied successfully' });
        }
    ]
}