const _ = require('underscore')._;
const userCore = require('../../../core/user');
const eventMembershipCore = require('../../../core/eventMembership');
const userRequestSchema = require('../requests').user;

const userQueryCore = require('../../../core/userQuery');

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const asyncWrap = common.asyncWrap;
const EventMembership = eventMembershipCore.EventMembership;

var authenticate = async function(req, res) {
    let token = await userCore.generateToken(req.user);
    res.status(200).json({token: token});
};

var signup = async function(req, res) {
    try {
        await validateRequest(req, userRequestSchema.signup);
        let userObj = {
            email: req.body.user.email,
            username: req.body.user.username,
            password: req.body.user.password
        };
        let user = await userCore.createUser(userObj);
        let response = {
            username: user.username,
            timeOfCreation: user.time.creation
        };
        res.status(201).json(response);
    }
    catch (error) {
        let err = packError(error);
        res.status(400).json(err);
    }
};

var changePassword = async function(req, res) {
    try {
        await validateRequest(req, userRequestSchema.changePassword);
        if(!req.user.validPassword(req.header('oldpassword'))) {
            let error = new Error("Bad password");
            error.status = 401;
            throw error;
        }
        await userCore.changePassword(req.user, req.header('newpassword'));
        res.status(200).send();
    }
    catch (error) {
        var err = packError(error);
        res.status(error.status||400).json(err);
    }
};

// /user/events/[role]
var getEventList = async function(req, res, eventListPromise) {
    try {
        let eventList = await eventListPromise;
        res.status(200).json(eventList);
    } 
    catch (error) {
        res.status(error.status||400).json(error.message);
    }
};

var getAllEventMemberships = async function(req, res) {
    return await getEventList(req, res, EventMembership.getAllMembershipsForUser(req.user));
};
var getEventMembershipsByRole = async function(req, res) {
    return await getEventList(req, res, EventMembership.getAllMembershipsForUserByRole(req.user, req.params.role));
};
var getEventMembership = async function(req, res) {
    try {
    let eventMembership = await EventMembership.getMembershipByEventID(req.user, req.params.eventID);
    res.status(200).json(eventMembership);
    }
    catch (error) {
        //HACK: This needs to go. Really.
        if(error.message=="No valid eventMembership object") return res.status(200).json({});
        res.status(error.status||400).json(error.message);
    }
};

var getSelfPosts = async function(req, res) {
    let posts = await userCore.getSelfPosts(req.user);
    res.status(200).json({posts:posts});
};
var getSelfMedia = async function(req, res) {
    let media = await userCore.getSelfMedia(req.user);
    res.status(200).json({media:media});
};
var getSelfEventPosts = async function(req, res) {
    let posts = await userCore.getSelfPosts(req.user, req.event);
    res.status(200).json({posts:posts});
};
var getSelfEventMedia = async function(req, res) {
    let media = await userCore.getSelfMedia(req.user, req.event);
    res.status(200).json({media:media});
};

var getEventPostVotes = async function(req, res) {
    let votes = await userQueryCore.getUserPostVotes(req.user, req.event);
    res.status(200).json({votes: votes});
};
var getAllPostVotes = async function(req, res) {
    let votes = await userQueryCore.getUserPostVotes(req.user);
    res.status(200).json({votes: votes});
};

// Wait, what's this for?
var returnAuthenticatedUser = function(req, res) {
    var user = _.pick(req.user, '_id', 'email', 'username');
    res.status(200).json(user);
};

module.exports = {
    authenticate: asyncWrap(authenticate),
    signup: asyncWrap(signup),
    changePassword: asyncWrap(changePassword),
    getAllEventMemberships: asyncWrap(getAllEventMemberships),
    getEventMembershipsByRole: asyncWrap(getEventMembershipsByRole),
    getEventMembership: asyncWrap(getEventMembership),
    getSelfPosts: asyncWrap(getSelfPosts),
    getSelfMedia: asyncWrap(getSelfMedia),
    getSelfEventPosts: asyncWrap(getSelfEventPosts),
    getSelfEventMedia: asyncWrap(getSelfEventMedia),
    getEventPostVotes: asyncWrap(getEventPostVotes),
    getAllPostVotes: asyncWrap(getAllPostVotes),
    returnAuthenticatedUser: asyncWrap(returnAuthenticatedUser)
};