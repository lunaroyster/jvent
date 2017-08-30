const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service');
const authController = require('../controllers/auth');
const AuthOnly = authController.AuthOnly;

router.get('/media/image/token', AuthOnly, serviceController.getImageUploadToken);

module.exports = router;