var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

// /event/
router.post('/', AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

// /event/:eventURL
//TODO: Remove appendEvent from these paths. Query directly at the router (only for required fields)
router.get('/:eventURL', eventController.appendEventIfVisible, eventController.getEvent);
router.patch('/:eventURL', AuthOnly, eventController.appendEventIfVisible, eventController.updateEvent);
router.delete('/:eventURL', AuthOnly, eventController.appendEventIfVisible, eventController.deleteEvent);

// /event/:eventURL/[function]
var usersRouter = express.Router();

usersRouter.get('/attending', AuthOnly, eventController.getEventAttendees);
usersRouter.get('/viewing');
usersRouter.get('/moderating');
usersRouter.get('/invited');

router.use('/:eventURL/users', usersRouter);
router.patch('/:eventURL/join', AuthOnly, eventController.appendEventIfVisible, eventController.joinEvent);

// /event/:eventURL/post
router.use('/:eventURL/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;
