const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const checkProfile = require('../middlewares/checkProfile');

const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.authenticate);
router.get('/logout', authController.logout);

router.get('/register', authController.register);
router.post('/register', authController.create);

router.get('/dashboard', ensureAuthenticated, dashboardController.index);
router.get('/dashboard/profile', ensureAuthenticated, dashboardController.profile);
router.post('/dashboard/profile', ensureAuthenticated, dashboardController.updateProfile);

module.exports = router;
