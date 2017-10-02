const eventCore = require('../../../core/event');
const eventMembershipCore = require('../../../core/eventMembership');
const eventRequestSchema = require('../requests').event;
const assert = require('chai').assert;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const asyncWrap = common.asyncWrap;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;
const EventMembership = eventMembershipCore.EventMembership;

// Errors
var badAuthError = Error("Bad Auth");
badAuthError.status = 404;

// /event/
var checkCreateEventPrivilege = function(req) {
    if(!req.user.privileges.createEvent) throw new Error("Bad privileges");
};
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
};
var createEvent = async function(req, res) {
    try {
        await validateRequest(req, eventRequestSchema.createEvent);
        await checkCreateEventPrivilege(req);
        let eventTemplate = createEventTemplateFromRequest(req, req.body.event);
        let event = await eventCore.createEvent(eventTemplate);
        let state = {
            status: "Created",
            event: {url: event.url, joinUrl: event.joinUrl}
        };
        res.status(201).json(state);
    }
    catch (error) {
        let err = packError(error);
        res.status(400).json(err);
    }
};

var getEvents = async function(req, res) {
    try {
        let publicEvents = await eventCore.getPublicEvents();
        res.status(200).json({events: publicEvents});
    }
    catch (error) {
        res.status(400).json({error: error});
    }
};

// /event/:eventID

var getEventAsModerator = async function(req, res) {
    try {
        let event = await req.getEvent();
        let eventMembership = await req.getEventMembership();
        let isModerator = await eventMembership.hasRole("moderator");
        if(!isModerator) throw Error();
        res.status(200).json({event: event});
    }
    catch (error) {
        res.status(400).json(error);
    }
};
var getEventAsRegular = async function(req, res) {
    try {
        let event = await req.getEvent();
        // let visibleEvent = await returnEventIfVisible(req.user, event);
        res.status(200).json({event: event});
    }
    catch (error) {
        res.status(400).json(error);
    }
};

var getEvent = async function(req, res) {
    if(req.header('moderator') == 1) {
        if(!req.user) throw badAuthError;
        return await getEventAsModerator(req, res);
    }
    else {
        return await getEventAsRegular(req, res);
    }
};

// /event/:eventID/users/[role]

var getUserList = async function(req, res, userListPromise) {
    try {
        let userList = await userListPromise;
        res.status(200).json(userList);
    }
    catch (error) {
        res.status(error.status).json(error.message);
    }
};

var getAllUsers = function(req, res) {
    return getUserList(req, res, EventMembership.getAllMembershipsForEvent(req.event));
};
var getUsersByRole = function(req, res) {
    return getUserList(req, res, EventMembership.getAllMembershipsForEventByRole(req.event, req.params.role));
};

// /event/:eventID/join
var canJoin = async function(req, res) {
    let ingress = req.event.ingress;
    if(ingress=="everyone") {
        return true;
    }
    else if(ingress=="link") {
        assert.equal(req.query.c, event.joinUrl, "Bad link");
        return true;
    }
    else if(ingress=="invite") {
        let eventMembership = await req.getEventMembership();
        if(eventMembership.hasRole("invite")) return true;
    }
};
var joinEvent = async function(req, res) {
    try {
        await canJoin(req, res);
        let eventMembership = await req.getEventMembership();
        await eventMembership.addRole("attendee");
        res.status(200).send();
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
};

// var returnEventIfVisible = async function(user, event) {
//     if(event.visibility=="public") {
//         return event;
//     }
//     else if(event.visibility=="unlisted") {
//         if(!user) throw badAuthError;
//         return event;
//     }
//     else if(event.visibility=="private") {
//         let eventMembership = await EventMembership.getMembership(user, event);
//         let isViewer = eventMembership.hasRole("viewer");
//         if(!isViewer) throw badAuthError;
//         return event;
//     }
// };

var moderatorOnly = async function(req, res, next) {
    let eventMembership = await req.getEventMembership();
    let isModerator = eventMembership.hasRole("moderator");
    if(!isModerator) {
        throw badAuthError;
    }
    return next();
};

module.exports = {
    createEvent: asyncWrap(createEvent),
    getEvents: asyncWrap(getEvents),
    getEvent: asyncWrap(getEvent),
    getAllUsers: asyncWrap(getAllUsers),
    getUsersByRole: asyncWrap(getUsersByRole),
    joinEvent: asyncWrap(joinEvent),
    moderatorOnly: asyncWrap(moderatorOnly)
};