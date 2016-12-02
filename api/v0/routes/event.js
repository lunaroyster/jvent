var express = require('express');
var router = express.Router();

router.post('/', );
router.get('/', );

router.get('/:eventID', );
router.patch('/:eventID', );
router.delete('/:eventID', );

router.use('/:eventID/post', require('./post'));

module.exports = router;
