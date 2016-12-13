var express = require('express');
var router = express.Router();
var passport = require('passport');

var userController = require('../controllers/user');

router.post('/authenticate', passport.authenticate('local', { session: false }), userController.authenticate);
router.post('/signup', userController.signup);

module.exports = router;
