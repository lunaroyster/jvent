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
// router.patch('/:eventURL', AuthOnly, eventController.appendEventIfVisible, eventController.updateEvent);
// router.delete('/:eventURL', AuthOnly, eventController.appendEventIfVisible, eventController.deleteEvent);

// /event/:eventURL/users {
var usersRouter = express.Router();
usersRouter.get('/viewer', eventController.getEventViewers);
usersRouter.get('/attendee', eventController.getEventAttendees);
usersRouter.get('/invite', eventController.getEventInvited);
usersRouter.get('/moderator', eventController.getEventModerators);
router.use('/:eventURL/users', AuthOnly, eventController.appendEventIfVisible, usersRouter);
// }

// /event/:eventURL/[function]
router.patch('/:eventURL/join', AuthOnly, eventController.appendEventIfVisible, eventController.joinEvent);

// /event/:eventURL/post
router.use('/:eventURL/post', eventController.appendEventIfVisible, require('./post'));

module.exports = router;
