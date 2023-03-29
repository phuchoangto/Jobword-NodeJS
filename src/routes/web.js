const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const multer = require('../config/multer');

const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const cvController = require('../controllers/cvController');
const jobController = require('../controllers/jobController');

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.authenticate);
router.get('/logout', authController.logout);

router.get('/register', authController.register);
router.post('/register', authController.create);

router.get('/dashboard', ensureAuthenticated, dashboardController.index);
router.get('/dashboard/profile', ensureAuthenticated, dashboardController.profile);
router.post('/dashboard/profile', ensureAuthenticated, multer.single('profilePic'), dashboardController.updateProfile);

router.get('/dashboard/cv', ensureAuthenticated, cvController.index);
router.post('/dashboard/cv', ensureAuthenticated, cvController.create);
router.delete('/dashboard/cv/:id', ensureAuthenticated, cvController.delete);


router.get('/dashboard/job', ensureAuthenticated, jobController.index);
router.get('/dashboard/job/create', ensureAuthenticated, jobController.create);
router.post('/dashboard/job', ensureAuthenticated, jobController.store);

module.exports = router;
