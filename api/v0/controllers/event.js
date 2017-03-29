var Q = require('q');
var eventCore = require('../../../core/event');
var eventMembershipCore = require('../../../core/eventMembership');
var eventRequestSchema = require('../requests/event');
var assert = require('chai').assert;

// Errors
var badAuthError = Error("Bad Auth");
badAuthError.status = 404;

// /event/

module.exports.createEvent = function(req, res) {
    Q.fcall(function() {
        req.check(eventRequestSchema.postEvent);
        return req.getValidationResult()
        .then(function(result) {
            if(!result.isEmpty()) {
                result.throw();
            }
            return;
        });
    })       //Validate request   
    .then(function() {
        if(req.user.privileges.createEvent) {
            return;
        }
        else {
            throw new Error("Bad privileges");
        }
    })         //Check user privileges
    .then(function() {
        var eventSettings = {
            name: req.body.event.name,
            byline: req.body.event.byline,
            description: req.body.event.description,
            visibility: req.body.event.visibility,
            ingress: req.body.event.ingress,
            comment: req.body.event.comment,
            user: req.user
        };
        return eventCore.createEvent(eventSettings, req.user);
    })         //Create event (using authenticated user)
    .then(function(event) {
        return event;
    })
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
        var err;
        try {
            err = error.array();
        } catch (e) {
            // console.log(e);
            if(e.name=="TypeError") {
                err = [{param:error.name, msg: error.message}];
            }
        }
        // console.log(err);
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
    eventCore.getEventByURLAsModerator(req.params.eventURL)
    .then(function(event) {
        return eventMembershipCore.isUserModerator(req.user, event)
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
    eventCore.getEventByURL(req.params.eventURL)
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
        if(req.user) {
            getEventAsModerator(req, res);
        }
    }
    else {
        getEventAsRegular(req, res);
    }
};

module.exports.updateEvent = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deleteEvent = function(req, res) {
    res.json(req);
    res.send();
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

module.exports.getEventAttendees = function(req, res) {
    return getUserList(req, res, eventMembershipCore.getEventAttendees(req.event));
};
module.exports.getEventViewers = function(req, res) {
    return getUserList(req, res, eventMembershipCore.getEventViewers(req.event));
};
module.exports.getEventInvited = function(req, res) {
    return getUserList(req, res, eventMembershipCore.getEventInvited(req.event));
};
module.exports.getEventModerators = function(req, res) {
    return getUserList(req, res, eventMembershipCore.getEventModerators(req.event));
};

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
            // if(req.query.c==event.joinUrl) {
            //     return;
            // }
            // else {
            //     throw new Error("Bad link");
            // }
        }
        else if(ingress=="invite") {
            return eventMembershipCore.isUserInvited(req.user, req.event);
        }
    })
    .then(function() {
        return eventMembershipCore.addAttendee(req.user, req.event);
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

module.exports.appendEventIfVisible = function(req, res, next) {
    eventCore.getEventByURL(req.params.eventURL)
    .then(function(event) {
        if(event.visibility=="public") {
            return event;
        }
        else if(event.visibility=="unlisted") {
            if(req.user) {
                return event;
            }
            else {
                throw badAuthError;
            }
        }
        else if(event.visibility=="private") {
            return eventMembershipCore.isUserViewer(req.user, event)
            .then(function(result) {
                if(!result) throw badAuthError;
                return event;
            })
            .catch(function(error) {
                throw error;
            });
        }
    })
    .then(function(event) {
        req.event = event;
        next();
    })
    .catch(function(error) {
        // console.log(error);
        next(error);
    });

};

var returnEventIfVisible = function(user, event) {
    return Q.fcall(function() {
        if(event.visibility=="public") {
            return event;
        }
        else if(event.visibility=="unlisted") {
            if(user) {
                return event;
            }
            else {
                throw badAuthError;
            }
        }
        else if(event.visibility=="private") {
            return eventMembershipCore.isUserViewer(user, event)
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
    eventMembershipCore.isUserModerator(req.user, req.event)
    .then(function(result) {
        if(!result) {
            return next(badAuthError);
        }
        return next();
    });
};