var express = require('express');
var router = express.Router();

var commonController = require('../controllers/common');
var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

//TODO: Restructure authentication and password routes
router.post('/changepassword', AuthOnly, userController.changePassword);
router.post('/authenticate', authController.localAuth, userController.authenticate);
router.post('/signup', userController.signup);
router.get('/', AuthOnly, userController.returnAuthenticatedUser);


// router.get('/me', AuthOnly, userController.returnAuthenticatedUser);
//
var eventsRouter = express.Router();
    eventsRouter.get('/', userController.getAllEventMemberships);
    eventsRouter.get('/role/:role', userController.getEventMembershipsByRole);
    eventsRouter.get('/:eventID', userController.getEventMembership); //TODO: Fix this route
router.use('/events', AuthOnly, eventsRouter);

var meRouter = express.Router();
    meRouter.get('/', userController.returnAuthenticatedUser);
    meRouter.post('/changepassword', userController.changePassword);
    meRouter.get('/event', userController.getAllEventMemberships);
    meRouter.get('/event/role/:role', userController.getEventMembershipsByRole);
    var meEventRouter = express.Router();
        meEventRouter.get('/', userController.getEventMembership);
        meEventRouter.get('/post', userController.getSelfEventPosts);
        meEventRouter.get('/media', userController.getSelfEventMedia);
    meRouter.use('/event/:eventID', commonController.appendEventID, commonController.appendEventIfVisible, meEventRouter)
    meRouter.get('/post', userController.getSelfPosts);
    meRouter.get('/media', userController.getSelfMedia);
router.use('/me', AuthOnly, meRouter);

var themRouter = express.Router();
    //themRouter.get('/', "Gets their public profile")
router.use('/:username', themRouter);

module.exports = router;
