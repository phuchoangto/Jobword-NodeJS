const passport = require('../config/passport');

module.exports = {
    login: (req, res, next) => {
        res.render('auth/login', { title: 'Login' });
    },

    authenticate: passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }),

    register: (req, res, next) => {
        res.render('auth/register', { title: 'Register' });
    },
}