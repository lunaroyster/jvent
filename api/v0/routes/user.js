var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');
var authController = require('../controllers/auth');

router.post('/changepassword', authController.AuthOnly, userController.changePassword);
router.post('/authenticate', authController.localAuth, userController.authenticate);
router.post('/signup', userController.signup);
router.get('/', authController.AuthOnly, userController.returnAuthenticatedUser);
router.get('/me', authController.AuthOnly, userController.returnAuthenticatedUser);

module.exports = router;