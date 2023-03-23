const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');

module.exports = {
    login: (req, res, next) => {
        res.render('auth/login', { title: 'Login' });
    },

    authenticate: passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }),

    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                res.render('auth/login', { title: 'Login', errors: err });
            }
        });
        res.redirect('/login');
    },

    register: (req, res, next) => {
        res.render('auth/register', { title: 'Register' });
    },

    create: async (req, res, next) => {
        const { email, username, password, confirmPassword, role } = req.body;
        const validation = registerSchema.validate({ email, username, password, confirmPassword, role });
        if (validation.error) {
            res.render('auth/register', { title: 'Register', errors: validation.error.details });
        }
        else {
            try {
                // check username, email exist
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email },
                            { username }
                        ]
                    }
                });
                if (user) {
                    res.render('auth/register', { title: 'Register', errors: [{ message: 'Username or email already exists' }] });
                    return;
                }
                else{
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            username,
                            password: hashedPassword,
                            role: role === 'EMPLOYER' ? Role.EMPLOYER : Role.JOB_SEEKER
                        }
                    });
                    res.redirect('/login');
                }             
            }
            catch (err) {
                res.render('auth/register', { title: 'Register', errors: err });
            }
        }
    }
}