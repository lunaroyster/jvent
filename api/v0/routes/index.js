const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.use('/event', authController.nonblockingjwtAuth, require('./event'));
router.use('/user', authController.nonblockingjwtAuth, require('./user'));
router.use('/service', authController.nonblockingjwtAuth, require('./service'));

module.exports = router;