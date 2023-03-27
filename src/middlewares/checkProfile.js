const { Role } = require('@prisma/client');

function checkProfile(req, res, next) {
    if (req.user.role === Role.JOB_SEEKER && req.user.JobSeeker) {
        return next();
    }
    if (req.user.role === Role.EMPLOYER && req.user.employer) {
        return next();
    }
  res.redirect('/dashboard/profile');
}

module.exports = checkProfile;