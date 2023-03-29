const { Role } = require('@prisma/client');

function isRole(role) {
    return function (req, res, next) {
        if (req.headers.accept === 'application/json') {
            if (req.user.role === role) {
                next();
            }
            else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        }
        else {
            if (req.user.role === role) {
                next();
            }
            else {
                res.redirect(`/login?redirect=${req.originalUrl}`);
            }
        }
    }
}

module.exports = isRole;