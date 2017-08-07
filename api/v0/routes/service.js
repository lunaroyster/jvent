var express = require('express');
var router = express.Router();

var serviceController = require('../controllers/service');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

router.get('/media/image/token', AuthOnly, serviceController.getImageUploadToken);

module.exports = router;