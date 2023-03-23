const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');

module.exports = {
    index: (req, res, next) => {
        res.render('dashboard/index', { title: 'Dashboard' });
    }
};
