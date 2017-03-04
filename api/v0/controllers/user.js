var Q = require('q');
var userCore = require('../../../core/user');
var eventMembershipCore = require('../../../core/eventMembership');

module.exports.authenticate = function(req, res) {
    userCore.generateToken(req.user)
    .then(function(token) {
        res.status(200);
        res.json({token: token});
    });
};

module.exports.signup = function(req, res) {
    Q.fcall(function() {
        var userObj = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        return userCore.createUser(userObj);
    })
    .then(function(status) {
        // Change status to user; figure out status by reading user object
        res.status(201);
        res.json(status);
    })
    .catch(function(error) {
        res.status(400);
        res.json(error);
    });
};

module.exports.changePassword = function(req, res) {
    Q.fcall(function() {
        //Sanitize/Validate request
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
        res.status(400);
        res.json(error);
    });
};

module.exports.getAttendedEvents = function(req, res) {
    return eventMembershipCore.getAttendedEvents(req.user)
    .then(function(attendedEventsList) {
        res.status(200).json(attendedEventsList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};
module.exports.getVisibleEvents = function(req, res) {
    return eventMembershipCore.getVisibleEvents(req.user)
    .then(function(visibleEventsList) {
        res.status(200).json(visibleEventsList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};
module.exports.getInvitedEvents = function(req, res) {
    return eventMembershipCore.getInvitedEvents(req.user)
    .then(function(invitedEventsList) {
        res.status(200).json(invitedEventsList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};
module.exports.getModeratedEvents = function(req, res) {
    return eventMembershipCore.getModeratedEvents(req.user)
    .then(function(moderatedEventsList) {
        res.status(200).json(moderatedEventsList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};

// Wait, what's this for?
module.exports.returnAuthenticatedUser = function(req, res) {
    res.json(req.user);
};