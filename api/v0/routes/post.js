var express = require('express');
var router = express.Router();

router.post('/', );
router.get('/', );

router.get('/:postID', );
router.patch('/:postID', );
router.delete('/:postID', );

router.use('/:postID/comment', require('./comment'));

module.exports = router;
