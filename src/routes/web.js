var express = require('express');
var router = express.Router();

var homeController = require('../controllers/homeController');
var authController = require('../controllers/authController');

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.authenticate);

module.exports = router;
