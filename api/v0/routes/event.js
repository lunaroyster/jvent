var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

// /event/
router.post('/', AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

router.use('/:eventURL', eventController.appendEventURL, eventController.appendPrivilegeGetter, ceRouter);

var ceRouter = express.Router(); //contextEventRouter

ceRouter.get('/', eventController.getEvent);
ceRouter.patch('/', eventController.updateEvent);
ceRouter.delete('/', eventController.deleteEvent);

var usersRouter = express.Router();
usersRouter.get('/viewer', eventController.getEventViewers);
usersRouter.get('/attendee', eventController.getEventAttendees);
usersRouter.get('/invite', eventController.getEventInvited);
usersRouter.get('/moderator', eventController.getEventModerators);

ceRouter.use('/users', usersRouter);
ceRouter.patch('/join', eventController.joinEvent);
ceRouter.use('/post', require('./post'));

module.exports = router;
