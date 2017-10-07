const eventCore = require('../../../core/event');
const eventMembershipCore = require('../../../core/eventMembership');
const EventMembership = eventMembershipCore.EventMembership;

// Errors
var badAuthError = Error("Bad Auth");
badAuthError.status = 404;

module.exports.validateRequest = async function(req, schema) {
    req.check(schema);
    let result = await req.getValidationResult();
    if(!result.isEmpty()) {
        result.throw();
    }
    return;
};

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
    let mediaObj = {
        user: req.user,
        event: req.event,
        link: media.link
    };
    return mediaObj;
};

module.exports.appendEventURL = function(req, res, next) {
    req.eventURL = req.params.eventURL;
    next();
};
module.exports.appendEventID = function(req, res, next) {
    req.eventID = req.params.eventID;
    next();
};

module.exports.appendEventGetter = function(req, res, next) {
    var EventGetter = async ()=> {
        if(req.event) return req.event;
        
        let eventID = req.eventID || req.params.eventID;
        let eventURL = req.eventURL || req.params.eventURL;
        // console.log(eventID, eventURL)
        let event;
        if(eventURL) event = await eventCore.getEventByURL(eventURL);
        if(eventID) event = await eventCore.getEventByID(eventID);

        if(event.visibility=="public") {
            req.event = event;
        }
        else if(event.visibility=="unlisted") {
            if(!req.user) throw badAuthError;
            req.event = event;
        }
        else if(event.visibility=="private") {
            if(!req.user) throw badAuthError;
            let eventMembership = await req.getEventMembership(false, event);
            if(!eventMembership.is("viewer")) throw badAuthError;
            req.event = event;
        }
        return req.event;
    };
    req.getEvent = EventGetter;
    next();
};

module.exports.appendEventMembershipGetter = function(req, res, next) {
    var EventMembershipGetter = async (createMembership, fetchedEvent)=> {
        if(req.EventMembership) return req.EventMembership;
        
        let event = fetchedEvent || await req.getEvent();
        if(!req.user || !event) throw Error("Failed to resolve memberships");
        let eventMembership = createMembership ? await EventMembership.getOrCreateMembership(req.user, event) : await EventMembership.getMembership(req.user, event);
        if(!eventMembership) throw Error("No such membership exists");
        req.EventMembership = eventMembership;
        return eventMembership;
    };
    req.getEventMembership = EventMembershipGetter;
    next();
};

module.exports.asyncWrap = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};