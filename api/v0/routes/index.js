var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth');

router.use('/event', authController.nonblockingjwtAuth, require('./event'));
router.use('/user', authController.nonblockingjwtAuth, require('./user'));

module.exports = router;