var Q = require('q');
var eventCore = require('../../../core/event');
var eventMembershipCore = require('../../../core/eventMembership');
var EventMembership = eventMembershipCore.EventMembership;

// Errors
var badAuthError = Error("Bad Auth");
badAuthError.status = 404;

module.exports.validateRequest = function(req, schema) {
    return Q.fcall(function() {
        req.check(schema);
        return req.getValidationResult()
        .then(function(result) {
            if(!result.isEmpty()) {
                result.throw();
            }
            return;
        });
    });
}

module.exports.packError = function(error) {
    var err;
    try {
        err = error.array();
    } catch (e) {
        if(e.name=="TypeError") {
            err = [{param:error.name, msg: error.message}];
        }
    }
    return err;
};

module.exports.createMediaTemplateFromRequest = function(req, media) {
    if(!media) return;
    var mediaObj = {
        user: req.user,
        event: req.event,
        link: media.link
    };
    return mediaObj;
};

module.exports.appendEventURL = function(req, res, next) {
    req.eventURL = req.params.eventURL;
    next();
}
module.exports.appendEventID = function(req, res, next) {
    req.eventID = req.params.eventID;
    next();
}

module.exports.appendEventGetter = function(req, res, next) {
    var EventGetter = function() {
        return Q.fcall(function() {
            if(req.event) return req.event;
            return eventCore.getEventByURL(req.eventURL || req.params.eventURL)
            .then(function(event) {
                if(event.visibility=="public") {
                    return event;
                }
                else if(event.visibility=="unlisted") {
                    if(!req.user) throw badAuthError;
                    return event;
                }
                else if(event.visibility=="private") {
                    if(!req.user) throw badAuthError;
                    return req.getEventMembership()
                    .then(function(eventMembership) {
                        if(eventMembership.hasRole("viewer")) return event;
                    });
                }
            })
            .then(function(event) {
                req.event = event;
                return event;
            })
            .catch(function(error) {
                next(error);
            });
        });
    };
    req.getEvent = EventGetter;
    next();
};

module.exports.appendEventMembershipGetter = function(req, res, next) {
    var EventMembershipGetter = function() {
        return Q.fcall(function() {
            if(req.EventMembership) return req.EventMembership;
            if(!req.user || !req.event) throw Error("Failed to resolve memberships");
            return EventMembership.getOrCreateMembership(req.user, req.event)
            .then(function(eventMembership) {
                req.EventMembership = eventMembership;
                return eventMembership;
            });
        });
    };
    req.getEventMembership = EventMembershipGetter;
    next();
};

module.exports.appendEventIfVisible = function(req, res, next) {
    Q.fcall(function() {
        var eventID = req.eventID || req.params.eventID;
        var eventURL = req.eventURL || req.params.eventURL;
        // console.log(eventID, eventURL)
        if(eventURL) return eventCore.getEventByURL(eventURL);
        return eventCore.getEventByID(eventID);
    })
    .then(function(event) {
        if(event.visibility=="public") {
            return event;
        }
        else if(event.visibility=="unlisted") {
            if(!req.user) throw badAuthError;
            return event;
        }
        else if(event.visibility=="private") {
            return req.getEventMembership()
            .then(function(eventMembership) {
                return eventMembership.hasRole("viewer");
            })
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
