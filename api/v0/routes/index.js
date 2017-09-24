const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.use(authController.nonblockingjwtAuth);

router.use('/event', require('./event'));
router.use('/user', require('./user'));
router.use('/service', require('./service'));

module.exports = router;