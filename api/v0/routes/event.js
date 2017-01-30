var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

router.post('/', authController.jwtAuth, eventController.createEvent);
router.get('/', eventController.getEvents);

router.get('/:eventID', eventController.getEventByID);
router.patch('/:eventID', authController.jwtAuth, eventController.updateEventByID);
router.delete('/:eventID', authController.jwtAuth, eventController.deleteEventByID);

router.use('/:eventID/post', eventController.appendEventID, require('./post'));

module.exports = router;
