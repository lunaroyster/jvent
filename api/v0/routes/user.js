var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');

var passport = require('passport');
var jwtAuth = passport.authenticate('jwt', { session: false});

router.post('/authenticate', passport.authenticate('local', { session: false }), userController.authenticate);
router.post('/signup', userController.signup);
router.get('/', jwtAuth, userController.returnAuthenticatedUser);

module.exports = router;
