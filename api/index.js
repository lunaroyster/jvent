const express = require('express');
const router = express.Router();

router.use('/v0', require('./v0/routes/index'));

module.exports = router;
