var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

router.post('/', authController.AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

router.get('/:eventID', eventController.appendEventIfVisible, eventController.getEvent);
router.patch('/:eventID', authController.AuthOnly, eventController.appendEventIfVisible, eventController.updateEvent);
router.delete('/:eventID', authController.AuthOnly, eventController.appendEventIfVisible, eventController.deleteEvent);

// router.use('/:eventID/post', eventController.appendEventID, require('./post'));
router.use('/:eventID/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;