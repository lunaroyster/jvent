var express = require('express');
var router = express.Router();

router.use('/', );
router.use('/:eventID', );
router.use('/:eventID/post', require('./post'));

module.exports = router;
