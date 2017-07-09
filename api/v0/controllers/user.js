var Q = require('q');
var _ = require('underscore')._;
var userCore = require('../../../core/user');
var eventMembershipCore = require('../../../core/eventMembership');
var userRequestSchema = require('../requests').user;

var common = require('./common');
var validateRequest = common.validateRequest;
var packError = common.packError;
var EventMembership = eventMembershipCore.EventMembership;

module.exports.authenticate = function(req, res) {
    userCore.generateToken(req.user)
    .then(function(token) {
        res.status(200);
        res.json({token: token});
    });
};

module.exports.signup = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, userRequestSchema.signup);
    })
    .then(function() {
        console.log("creating userobj")
        var userObj = {
            email: req.body.user.email,
            username: req.body.user.username,
            password: req.body.user.password
        };
        return userCore.createUser(userObj);
    })
    .then(function(user) {
        var response = {
            username: user.username,
            timeOfCreation: user.time.creation
        }
        res.status(201);
        res.json(response);
    })
    .catch(function(error) {
        var err = packError(error);
        res.status(400).json(err);
    });
};

module.exports.changePassword = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, userRequestSchema.changePassword);
    })
    .then(function() {
        if(req.user.validPassword(req.header('oldpassword'))) {
            return;
        }
        else {
            res.status(401);
            throw new Error("Bad password");
        }
    })
    .then(function() {
        return userCore.changePassword(req.user, req.header('newpassword'));
    })
    .then(function() {
        res.status(200);
        res.send();
    })
    .fail(function(error) {
        var err = packError(error);
        res.json(err);
    });
};

// /user/events/[role]
var getEventList = function(req, res, eventListPromise) {
    return eventListPromise
    .then(function(eventList) {
        res.status(200).json(eventList);
    })
    .catch(function(error) {
        res.status(error.status).json(error.message);
    });
};

module.exports.getAllEventMemberships = function(req, res) {
    return getEventList(req, res, EventMembership.getAllMembershipsForUser(req.user));
};
module.exports.getEventMembershipsByRole = function(req, res) {
    return getEventList(req, res, EventMembership.getAllMembershipsForUserByRole(req.user, req.params.role));
};
module.exports.getEventMembership = function(req, res) {
    return EventMembership.getMembershipByEventID(req.user, req.params.eventID)
    .then(function(eventMembership) {
        res.status(200).json(eventMembership);
    })
    .catch(function(error) {
        //HACK: This needs to go. Really.
        if(error.message="No valid eventMembership object") return res.status(200).json({});
        res.status(error.status||400).json(error.message);
    });
}

// Wait, what's this for?
module.exports.returnAuthenticatedUser = function(req, res) {
    var user = _.pick(req.user, '_id', 'email', 'username');
    res.status(200).json(user);
};
