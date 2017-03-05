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
router.use('/events', AuthOnly, eventsRouter);

var eventsRouter = express.Router();
eventsRouter.get('/viewing', userController.getVisibleEvents);
eventsRouter.get('/attending', userController.getAttendedEvents);
eventsRouter.get('/invited', userController.getInvitedEvents);
eventsRouter.get('/moderating', userController.getModeratedEvents);

module.exports = router;
