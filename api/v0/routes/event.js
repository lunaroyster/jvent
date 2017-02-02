var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

router.post('/', authController.AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

//TODO: Remove appendEvent from these paths. Query directly at the router (only for required fields)
router.get('/:eventURL', eventController.appendEventIfVisible, eventController.getEvent);
router.patch('/:eventURL', authController.AuthOnly, eventController.appendEventIfVisible, eventController.updateEvent);
router.delete('/:eventURL', authController.AuthOnly, eventController.appendEventIfVisible, eventController.deleteEvent);

router.patch('/:eventURL/join', authController.AuthOnly, eventController.appendEventIfVisible, eventController.joinEvent);
router.use('/:eventURL/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;