const Q = require('q');
const _ = require('underscore')._;
const userCore = require('../../../core/user');
const eventMembershipCore = require('../../../core/eventMembership');
const userRequestSchema = require('../requests').user;

const userQueryCore = require('../../../core/userQuery');

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const EventMembership = eventMembershipCore.EventMembership;

module.exports.authenticate = function(req, res) {
    userCore.generateToken(req.user)
    .then((token)=> {
        res.status(200);
        res.json({token: token});
    });
};

module.exports.signup = function(req, res) {
    Q.fcall(()=> {
        return validateRequest(req, userRequestSchema.signup);
    })
    .then(()=> {
        var userObj = {
            email: req.body.user.email,
            username: req.body.user.username,
            password: req.body.user.password
        };
        return userCore.createUser(userObj);
    })
    .then((user)=> {
        var response = {
            username: user.username,
            timeOfCreation: user.time.creation
        }
        res.status(201);
        res.json(response);
    })
    .catch((error)=> {
        var err = packError(error);
        res.status(400).json(err);
    });
};

module.exports.changePassword = function(req, res) {
    Q.fcall(()=> {
        return validateRequest(req, userRequestSchema.changePassword);
    })
    .then(()=> {
        if(req.user.validPassword(req.header('oldpassword'))) {
            return;
        }
        else {
            var error = new Error("Bad password");
            error.status = 401;
            throw error;
        }
    })
    .then(()=> {
        return userCore.changePassword(req.user, req.header('newpassword'));
    })
    .then(()=> {
        res.status(200);
        res.send();
    })
    .fail((error)=> {
        var err = packError(error);
        res.status(error.status||400).json(err);
    });
};

// /user/events/[role]
var getEventList = function(req, res, eventListPromise) {
    return eventListPromise
    .then((eventList)=> {
        res.status(200).json(eventList);
    })
    .catch((error)=> {
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
    .then((eventMembership)=> {
        res.status(200).json(eventMembership);
    })
    .catch((error)=> {
        //HACK: This needs to go. Really.
        if(error.message="No valid eventMembership object") return res.status(200).json({});
        res.status(error.status||400).json(error.message);
    });
}

module.exports.getSelfPosts = function(req, res) {
    return userCore.getSelfPosts(req.user)
    .then((posts)=> {
        res.status(200).json({posts:posts})
    });
};
module.exports.getSelfMedia = function(req, res) {
    return userCore.getSelfMedia(req.user)
    .then((media)=> {
        res.status(200).json({media:media})
    });
};
module.exports.getSelfEventPosts = function(req, res) {
    return userCore.getSelfPosts(req.user, req.event)
    .then((posts)=> {
        res.status(200).json({posts:posts})
    });
};
module.exports.getSelfEventMedia = function(req, res) {
    return userCore.getSelfMedia(req.user, req.event)
    .then((media)=> {
        res.status(200).json({media:media})
    });
};

module.exports.getEventPostVotes = function(req, res) {
    return userQueryCore.getUserPostVotes(req.user, req.event)
    .then((votes)=> {
        res.status(200).json({votes: votes})
    })
};
module.exports.getAllPostVotes = function(req, res) {
    return userQueryCore.getUserPostVotes(req.user)
    .then((votes)=> {
        res.status(200).json({votes: votes})
    })
}

// Wait, what's this for?
module.exports.returnAuthenticatedUser = function(req, res) {
    var user = _.pick(req.user, '_id', 'email', 'username');
    res.status(200).json(user);
};
