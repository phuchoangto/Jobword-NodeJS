const { Role } = require('@prisma/client');
const prisma = require('../config/prisma');

async function ensureUserHasProfile(req, res, next) {
    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        include: { JobSeeker: true, Employer: true }
    });
    if (!user.JobSeeker && !user.Employer) {
        res.redirect('/dashboard/profile');
    }
    else {
        next();
    }
}

module.exports = ensureUserHasProfile;