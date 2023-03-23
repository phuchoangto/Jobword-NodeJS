var express = require('express');
var router = express.Router();

var homeController = require('../controllers/homeController');
var authController = require('../controllers/authController');
var dashboardController = require('../controllers/dashboardController');

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.authenticate);
router.get('/logout', authController.logout);

router.get('/register', authController.register);
router.post('/register', authController.create);

router.get('/dashboard', dashboardController.index);

module.exports = router;
