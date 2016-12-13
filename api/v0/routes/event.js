var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');

var passport = require('passport');
var jwtAuth = passport.authenticate('jwt', { session: false});

router.post('/', eventController.createEvent);
router.get('/', eventController.getEvents);

router.get('/:eventID', eventController.getEventByID);
router.patch('/:eventID', eventController.updateEventByID);
router.delete('/:eventID', eventController.deleteEventByID);

router.use('/:eventID/post', eventController.appendEventID, require('./post'));

module.exports = router;
