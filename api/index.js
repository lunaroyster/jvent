var express = require('express');
var router = express.Router();

router.use('/v0', require('./v0/routes/index'));

module.exports = router;
