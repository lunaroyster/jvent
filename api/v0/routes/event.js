const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event');
const commonController = require('../controllers/common');
const eventSettingsController = require('../controllers/eventSettings');
const mediaController = require('../controllers/media');
const authController = require('../controllers/auth');
const AuthOnly = authController.AuthOnly;


router.post('/', AuthOnly, eventController.createEvent);
router.get('/', eventController.getEvents);

var ceRouter = express.Router(); //contextEvent Router
    ceRouter.get('/', eventController.getEvent);
    ceRouter.patch('/join', AuthOnly, eventController.joinEvent);

    var usersRouter = express.Router(); //contextEvent/users Router
        usersRouter.get('/', eventController.getAllUsers);
        usersRouter.get('/:role', eventController.getUsersByRole);
    ceRouter.use('/users', AuthOnly, usersRouter);

    var mediaRouter = express.Router();
        mediaRouter.post('/', AuthOnly, mediaController.createEventMedia);
        mediaRouter.get('/', mediaController.getEventMedia);

        var cmRouter = express.Router(); //contextEvent/media Router
            cmRouter.get('/', mediaController.getEventMediaByURL);
        mediaRouter.use('/:mediaURL', mediaController.appendMediaURL, cmRouter);
    ceRouter.use('/media', mediaRouter);

    var settingsRouter = express.Router();
        // settingsRouter.get('/', eventSettingsController.getSettings);

        settingsRouter.get('/eventBackground', eventSettingsController.getEventBackground);
        settingsRouter.post('/eventBackground', eventSettingsController.setEventBackground);
    ceRouter.use('/settings', AuthOnly, settingsRouter);

    ceRouter.use('/post', require('./post'));

router.use('/:eventURL', commonController.appendEventURL, commonController.appendEventGetter, commonController.appendEventMembershipGetter, ceRouter);

module.exports = router;
