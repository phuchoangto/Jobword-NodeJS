const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');

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

    create: async (req, res, next) => {
        const { email, username, password, confirmPassword } = req.body;
        try {
            await registerSchema.validateAsync({ email, username, password, confirmPassword });
            next();
        } catch (err) {
            res.render('auth/register', { title: 'Register', errors: err.details });
        }
    }
}