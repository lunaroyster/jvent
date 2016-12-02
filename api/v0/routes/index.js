var express = require('express');
var router = express.Router();

router.use('/event', require('./event'));

module.exports = router;
