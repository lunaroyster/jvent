var express = require('express');
var router = express.Router();

var eventController = require('../controllers/event');
var mediaController = require('../controllers/media');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;


router.post('/', AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

var ceRouter = express.Router(); //contextEvent Router
    ceRouter.get('/', eventController.appendEventIfVisible, eventController.getEvent);
    ceRouter.patch('/join', AuthOnly, eventController.appendEventIfVisible, eventController.joinEvent);

    var usersRouter = express.Router(); //contextEvent/users Router
        usersRouter.get('/viewer', eventController.getEventViewers);
        usersRouter.get('/attendee', eventController.getEventAttendees);
        usersRouter.get('/invite', eventController.getEventInvited);
        usersRouter.get('/moderator', eventController.getEventModerators);
    ceRouter.use('/users', AuthOnly, eventController.appendEventIfVisible, usersRouter);

    var mediaRouter = express.Router();
        mediaRouter.post('/', mediaController.createEventMedia);
        mediaRouter.get('/', mediaController.getEventMedia);
    
        var cmRouter = express.Router(); //contextEvent/media Router
            cmRouter.get('/', mediaController.getEventMediaByURL);
        mediaRouter.use('/:mediaURL', mediaController.appendMediaURL, cmRouter);
    ceRouter.use('/media', eventController.appendEventIfVisible, mediaRouter);

    ceRouter.use('/post', eventController.appendEventIfVisible, require('./post'));

router.use('/:eventURL', eventController.appendEventURL, ceRouter);

module.exports = router;
