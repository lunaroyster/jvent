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
    ceRouter.get('/', commonController.appendEventIfVisible, eventController.getEvent);
    ceRouter.patch('/join', AuthOnly, commonController.appendEventIfVisible, eventController.joinEvent);

    var usersRouter = express.Router(); //contextEvent/users Router
        usersRouter.get('/', eventController.getAllUsers);
        usersRouter.get('/:role', eventController.getUsersByRole);
    ceRouter.use('/users', AuthOnly, commonController.appendEventIfVisible, usersRouter);

    var mediaRouter = express.Router();
        mediaRouter.post('/', AuthOnly, mediaController.createEventMedia);
        mediaRouter.get('/', mediaController.getEventMedia);

        var cmRouter = express.Router(); //contextEvent/media Router
            cmRouter.get('/', mediaController.getEventMediaByURL);
        mediaRouter.use('/:mediaURL', mediaController.appendMediaURL, cmRouter);
    ceRouter.use('/media', commonController.appendEventIfVisible, mediaRouter);

    var settingsRouter = express.Router();
        // settingsRouter.get('/', eventSettingsController.getSettings);

        settingsRouter.get('/eventBackground', eventSettingsController.getEventBackground);
        settingsRouter.post('/eventBackground', eventSettingsController.setEventBackground);
    ceRouter.use('/settings', AuthOnly, commonController.appendEventIfVisible, settingsRouter);

    ceRouter.use('/post', commonController.appendEventIfVisible, require('./post'));

router.use('/:eventURL', commonController.appendEventURL, commonController.appendEventMembershipGetter, ceRouter);

module.exports = router;
