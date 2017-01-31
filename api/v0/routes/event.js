var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

router.post('/', authController.blockingjwtAuth, eventController.createEvent);
router.get('/', authController.nonblockingjwtAuth, eventController.getEvents);

router.get('/:eventID', authController.nonblockingjwtAuth, eventController.getEventByID);
router.patch('/:eventID', authController.blockingjwtAuth, eventController.updateEventByID);
router.delete('/:eventID', authController.blockingjwtAuth, eventController.deleteEventByID);

router.use('/:eventID/post', eventController.appendEventID, require('./post'));

module.exports = router;