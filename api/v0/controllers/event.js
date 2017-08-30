const Q = require('q');
const eventCore = require('../../../core/event');
const eventMembershipCore = require('../../../core/eventMembership');
const eventRequestSchema = require('../requests').event;
const assert = require('chai').assert;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;
const EventMembership = eventMembershipCore.EventMembership;

// Errors
var badAuthError = Error("Bad Auth");
badAuthError.status = 404;

// /event/
var checkCreateEventPrivilege = function(req) {
    if(!req.user.privileges.createEvent) throw new Error("Bad privileges");
    return;
}
var createEventTemplateFromRequest = function(req, event) {
    return {
        name: event.name,
        byline: event.byline,
        description: event.description,
        visibility: event.visibility,
        ingress: event.ingress,
        comment: event.comment,
        user: req.user
    };
}
module.exports.createEvent = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, eventRequestSchema.createEvent)
    })
    .then(function() {
        return checkCreateEventPrivilege(req);
    })         //Check user privileges
    .then(function() {
        var eventTemplate = createEventTemplateFromRequest(req, req.body.event);
        // var mediaTemplate = undefined;
        // if(req.body.media) {
        //     mediaTemplate = createMediaTemplateFromRequest(req, req.body.media)
        // }
        return eventCore.createEvent(eventTemplate);
    })         //Create event (using authenticated user)
    .then(function(event) {
        var state = {
            status: "Created",
            event: {
                url: event.url,
                joinUrl: event.joinUrl
            }
        };
        res.status(201).json(state);
        return;
    })    //Send event creation success
    .catch(function(error) {
        var err = packError(error);
        res.status(400).json(err);
    });
};

module.exports.getEvents = function(req, res) {
    var responseObject = {};
    eventCore.getPublicEvents()
    .then(function(events) {
        responseObject.events = events;
        res.status(200);
        res.json(responseObject);
    }, function(error) {
        responseObject.error = error;
        res.status(400);
        res.json(responseObject);
    });
};

// /event/:eventID

var getEventAsModerator = function(req, res) {
    eventCore.getEventByURLAsModerator(req.eventURL)
    .then(function(event) {
        // return eventMembershipCore.isUserModerator(req.user, event)
        return req.getEventMembership()
        .then(function(eventMembership) {
            return eventMembership.hasRole("moderator");
        })
        .then(function(result) {
            if(!result) throw Error();
            return event;
        });
    })
    .then(function(event) {
        res.status(200).json({event: event});
    })
    .catch(function(error) {
        res.status(400).json(error);
    });
};
var getEventAsRegular = function(req, res) {
    eventCore.getEventByURL(req.eventURL)
    .then(function(event) {
        return returnEventIfVisible(req.user, event);
    })
    .then(function(event) {
        res.status(200).json({event: event});
    })
    .catch(function(error) {
        res.status(400).json(error);
    });
};

module.exports.getEvent = function(req, res) {
    if(req.header('moderator') == 1) {
        if(!req.user) throw badAuthError;
        getEventAsModerator(req, res);
    }
    else {
        getEventAsRegular(req, res);
    }
};

// /event/:eventID/users/[role]

var getUserList = function(req, res, userListPromise) {
    return userListPromise
    .then(function(userList) {
        res.status(200).json(userList);
    })
    .catch(function(error) {
        res.status(error.status).json(error.message);
    });
};

module.exports.getAllUsers = function(req, res) {
    return getUserList(req, res, EventMembership.getAllMembershipsForEvent(req.event));
}
module.exports.getUsersByRole = function(req, res) {
    return getUserList(req, res, EventMembership.getAllMembershipsForEventByRole(req.event, req.params.role));
}

// /event/:eventID/join

module.exports.joinEvent = function(req, res) {
    Q.fcall(function() {
        var ingress = req.event.ingress;
        if(ingress=="everyone") {
            return;
        }
        else if(ingress=="link") {
            assert.equal(req.query.c, event.joinUrl, "Bad link");
            return;
        }
        else if(ingress=="invite") {
            return req.getEventMembership()
            .then(function(eventMembership) {
                if(eventMembership.hasRole("invite")) return event;
            })
        }
    })
    .then(function() {
        return req.getEventMembership()
        .then(function(eventMembership) {
            return eventMembership.addRole("attendee");
        });
    })
    .then(function() {
        res.status(200).send();
    })
    .fail(function(error) {
        console.log(error);
        res.status(400).send();
    })
    .done();
};


var returnEventIfVisible = function(user, event) {
    return Q.fcall(function() {
        if(event.visibility=="public") {
            return event;
        }
        else if(event.visibility=="unlisted") {
            if(!user) throw badAuthError;
            return event;
        }
        else if(event.visibility=="private") {
            return EventMembership.getMembership(user, membership)
            .then(function(eventMembership) {
                return eventMembership.hasRole("viewer");
            })
            .then(function(result) {
                if(!result) throw badAuthError;
                return event;
            })
            .catch(function(error) {
                throw badAuthError;
            });
        }
    });
};

module.exports.moderatorOnly = function(req, res, next) {
    req.getEventMembership()
    .then(function(eventMembership) {
        return eventMembership.hasRole("moderator");
    })
    .then(function(result) {
        if(!result) {
            return next(badAuthError);
        }
        return next();
    });
};
