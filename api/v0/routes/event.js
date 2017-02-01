var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

router.post('/', authController.AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

router.get('/:eventID', eventController.getEventByID);
router.patch('/:eventID', authController.AuthOnly, eventController.updateEventByID);
router.delete('/:eventID', authController.AuthOnly, eventController.deleteEventByID);

// router.use('/:eventID/post', eventController.appendEventID, require('./post'));
router.use('/:eventID/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;