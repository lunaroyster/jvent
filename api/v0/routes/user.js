const express = require('express');
const router = express.Router();

const commonController = require('../controllers/common');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const AuthOnly = authController.AuthOnly;

//TODO: Restructure authentication and password routes
router.post('/authenticate', authController.localAuth, userController.authenticate);
router.post('/signup', userController.signup);
router.get('/', AuthOnly, userController.returnAuthenticatedUser);

var eventsRouter = express.Router();
    eventsRouter.get('/', userController.getAllEventMemberships);
    eventsRouter.get('/role/:role', userController.getEventMembershipsByRole);
    eventsRouter.get('/:eventID', userController.getEventMembership); //TODO: Fix this route
router.use('/events', AuthOnly, eventsRouter);

var meRouter = express.Router();
    meRouter.get('/', userController.returnAuthenticatedUser);
    meRouter.post('/changepassword', userController.changePassword);
    var meEventRouter = express.Router();
        meEventRouter.get('/', userController.getAllEventMemberships);
        meEventRouter.get('/role/:role', userController.getEventMembershipsByRole);
        var meEventContextRouter = express.Router();
            meEventContextRouter.get('/', userController.getEventMembership);
            meEventContextRouter.get('/post', userController.getSelfEventPosts);
            meEventContextRouter.get('/post/votes', userController.getEventPostVotes);
            meEventContextRouter.get('/media', userController.getSelfEventMedia);
        meEventRouter.use('/:eventID', commonController.appendEventID, commonController.appendEventIfVisible, meEventContextRouter);
    meRouter.use('/event', meEventRouter);
    meRouter.get('/post', userController.getSelfPosts);
    meRouter.get('/post/votes', userController.getAllPostVotes);
    meRouter.get('/media', userController.getSelfMedia);
router.use('/me', AuthOnly, meRouter);

var themRouter = express.Router();
    //themRouter.get('/', "Gets their public profile")
router.use('/:username', themRouter);

module.exports = router;
