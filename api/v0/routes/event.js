var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');

// /event/
router.post('/', authController.AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

// /event/:eventURL
//TODO: Remove appendEvent from these paths. Query directly at the router (only for required fields)
router.get('/:eventURL', eventController.appendEventIfVisible, eventController.getEvent);
router.patch('/:eventURL', authController.AuthOnly, eventController.appendEventIfVisible, eventController.updateEvent);
router.delete('/:eventURL', authController.AuthOnly, eventController.appendEventIfVisible, eventController.deleteEvent);

// /event/:eventURL/[function]
//TODO: Route separately?
router.get('/:eventURL/users');
router.get('/:eventURL/users/attending');
router.get('/:eventURL/users/viewing');
router.get('/:eventURL/users/moderating');
router.get('/:eventURL/users/invited');

router.patch('/:eventURL/join', authController.AuthOnly, eventController.appendEventIfVisible, eventController.joinEvent);

// /event/:eventURL/post
router.use('/:eventURL/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;