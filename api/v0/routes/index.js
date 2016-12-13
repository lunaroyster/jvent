var express = require('express');
var router = express.Router();

router.use('/event', require('./event'));
router.use('/user', require('./user'));

module.exports = router;
