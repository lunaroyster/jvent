var express = require('express');
var router = express.Router();

router.use('/', );
router.use('/:postID', );
router.use('/:postID/comment', require('./comment'));

module.exports = router;
