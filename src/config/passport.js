const { PrismaClient } = require('@prisma/client');
const { Strategy } = require('passport-local');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const passport = require('passport');

passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return done(null, false, { message: 'Incorrect email' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        console.log(validPassword);
        if (!validPassword) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;