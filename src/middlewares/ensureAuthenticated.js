function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`/login?redirect=${req.originalUrl}`);
}

module.exports = ensureAuthenticated;