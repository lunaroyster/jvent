var Q = require('q');
var eventCore = require('../../../core/event');
var eventMembershipCore = require('../../../core/eventMembership');
var eventRequestSchema = require('../requests/event');

// Errors
var badAuthError = Error("Bad Auth");
badAuthError.status = 404;

// /event/

module.exports.createEvent = function(req, res) {
    req.check(eventRequestSchema.postEvent);
    req.getValidationResult()
    .then(function(result) {
        if(!result.isEmpty()) {
            result.throw();
        }
        return;
    })   //Validate request
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

module.exports.getEvent = function(req, res) {
    var responseObject = {};
    responseObject.event = req.event;
    res.status(200).json(responseObject);
};

module.exports.updateEvent = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deleteEvent = function(req, res) {
    res.json(req);
    res.send();
};

// /event/:eventID/users
module.exports.getEventAttendees = function(req, res) {
    eventMembershipCore.isUserModerator(req.user, req.event)
    .then(function(result) {
        if(!result) {
            throw badAuthError;
        }
        return;
    })
    .then(function() {
        return eventMembershipCore.getEventAttendees(req.event);
    })
    .then(function(eventAttendeeList) {
        res.status(200).json(eventAttendeeList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};

module.exports.getEventViewers = function(req, res) {
    eventMembershipCore.isUserModerator(req.user, req.event)
    .then(function(result) {
        if(!result) {
            throw badAuthError;
        }
        return;
    })
    .then(function() {
        return eventMembershipCore.getEventViewers(req.event);
    })
    .then(function(eventViewerList) {
        res.status(200).json(eventViewerList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};

module.exports.getEventInvitees = function(req, res) {
    eventMembershipCore.isUserModerator(req.user, req.event)
    .then(function(result) {
        if(!result) {
            throw badAuthError;
        }
        return;
    })
    .then(function() {
        return eventMembershipCore.getEventInvitees(req.event);
    })
    .then(function(eventInviteeList) {
        res.status(200).json(eventInviteeList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};

module.exports.getEventModerators = function(req, res) {
    eventMembershipCore.isUserModerator(req.user, req.event)
    .then(function(result) {
        if(!result) {
            throw badAuthError;
        }
        return;
    })
    .then(function() {
        return eventMembershipCore.getEventModerators(req.event);
    })
    .then(function(eventModeratorList) {
        res.status(200).json(eventModeratorList);
    })
    .catch(function(error) {
        console.log(error);
        res.status(error.status).json(error.message);
    });
};

// /event/:eventID/join

module.exports.joinEvent = function(req, res) {
    Q.fcall(function() {
        var ingress = req.event.ingress;
        if(ingress=="everyone") {
            return;
        }
        else if(ingress=="link") {
            if(req.query.c==event.joinUrl) {
                return;
            }
            else {
                throw new Error("Bad link");
            }
        }
        else if(ingress=="invite") {
            return eventMembershipCore.isUserInvitee(req.user, req.event);
        }
    })
    .then(function() {
        return eventMembershipCore.addAttendee(req.user, req.event);
    })
    .then(function() {
        res.status(200).send();
    })
    .fail(function(error) {
        res.status(400).send();
    })
    .done();
};

module.exports.appendEventIfVisible = function(req, res, next) {
    eventCore.getEventByURL(req.params.eventURL)
    .then(function(event) {
        if(event.visibility=="public") {
            req.event = event;
            return;
        }
        else if(event.visibility=="unlisted") {
            if(req.user) {
                req.event = event;
                return;
            }
            else {
                throw badAuthError;
            }
        }
        else if(event.visibility=="private") {
            return eventMembershipCore.isUserViewer(req.user, event)
            .catch(function(error) {
                throw badAuthError;
            });
        }
    })
    .then(function() {
        next();
    })
    .catch(function(error) {
        // console.log(error);
        next(error);
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