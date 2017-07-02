var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

//TODO: Restructure authentication and password routes
router.post('/changepassword', AuthOnly, userController.changePassword);
router.post('/authenticate', authController.localAuth, userController.authenticate);
router.post('/signup', userController.signup);
router.get('/', AuthOnly, userController.returnAuthenticatedUser);
router.get('/me', AuthOnly, userController.returnAuthenticatedUser);

var eventsRouter = express.Router();
    eventsRouter.get('/', userController.getAllEvents);
    eventsRouter.get('/viewer', userController.getVisibleEvents);
    eventsRouter.get('/attendee', userController.getAttendedEvents);
    eventsRouter.get('/invite', userController.getInvitedEvents);
    eventsRouter.get('/moderator', userController.getModeratedEvents);
router.use('/events', AuthOnly, eventsRouter);

module.exports = router;
