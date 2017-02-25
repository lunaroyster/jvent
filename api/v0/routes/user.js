var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

router.post('/changepassword', AuthOnly, userController.changePassword);
router.post('/authenticate', authController.localAuth, userController.authenticate);
router.post('/signup', userController.signup);
router.get('/', AuthOnly, userController.returnAuthenticatedUser);
router.get('/me', AuthOnly, userController.returnAuthenticatedUser);

module.exports = router;
