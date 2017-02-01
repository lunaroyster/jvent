var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

router.post('/', authController.AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

router.get('/:eventURL', eventController.appendEventIfVisible, eventController.getEvent);
router.patch('/:eventURL', authController.AuthOnly, eventController.appendEventIfVisible, eventController.updateEvent);
router.delete('/:eventURL', authController.AuthOnly, eventController.appendEventIfVisible, eventController.deleteEvent);

router.use('/:eventURL/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;