function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.headers.accept === 'application/json') {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    res.redirect(`/login?redirect=${req.originalUrl}`);
}

module.exports = ensureAuthenticated;