const mongoose = require('mongoose');
const Q = require('q');
// const User = mongoose.model('User');
const urlCore = require('./url');
const userListCore = require('./userList');
const eventMembershipCore = require('./eventMembership');
const eventFindQuery = require('./eventFindQuery');
const mediaCore = require('./media');

const EventMembership = eventMembershipCore.EventMembership;

const Event = mongoose.model('Event');

// Create Event
var getUniqueEventURL = async function(length) {
    let url = urlCore.generateRandomUrl(length);
    let event = await Event.findOne({url: url});
    if(!event) {
        return url;
    }
    else {
        return await getUniqueEventURL(length);
    }
};
var createEventDocument = function(eventConfig, user) {
    var newEvent = new Event({
        name: eventConfig.name,
        byline: eventConfig.byline,
        description: eventConfig.description,
        visibility: eventConfig.visibility,
        ingress: eventConfig.ingress,
        comment: eventConfig.comment,
        url: eventConfig.url,
        timeOfCreation: Date.now()
    });
    if(eventConfig.ingress=="link") {
        newEvent.joinUrl = urlCore.generateRandomUrl(11);
    }
    newEvent.assignOrganizer(user);
    return newEvent;
};
var saveEvent = async function(event) {
    return returnEventOrError(await event.save());
};
var createEvent = async function(eventConfig) {
    let user = eventConfig.user;
    eventConfig.url = await getUniqueEventURL(6);
    let event = await saveEvent(createEventDocument(eventConfig, user));
    
    let eventMembership = EventMembership.createUnsavedMembership(user, event);
    await eventMembership.addRoles(["organizer", "moderator"]);
    event = saveEvent(event);
    return event;
};

// Get Events
var getPublicEvents = async function() {
    // TODO: query to select events based on time/location/rating/uploader etc
    var eventQuery = Event
    .find({visibility: "public"})
    .populate('backgroundImage')
    .select('-_id name description byline url organizer.name ingress backgroundImage');
    return eventQuery.exec();
};
var queryEvents = function(query) {
    //TODO
};

// Get Event
var getEventByID = async function(eventID) {
    return Event.findOne({_id: eventID})
    .populate('backgroundImage')
    .select('name byline description url organizer.name ingress visibility timeOfCreation superCollection backgroundImage')
    .then(returnEventOrError);
};
var getEventByURL = async function(url) {
    return Event.findOne({url: url})
    .populate('backgroundImage')
    .select('name byline description url organizer.name ingress visibility timeOfCreation superCollection backgroundImage')
    .then(returnEventOrError);
};
var getEventByURLAsModerator = async function(url) {
    return Event.findOne({url: url})
    .populate('backgroundImage')
    .select('name byline description url organizer.name ingress visibility timeOfCreation roles backgroundImage')
    .then(returnEventOrError);
};
var getEventIfAttendee = async function(user, eventID) {

};

var setEventBackground = async function(event, mediaConfig) {
    let media = await mediaCore.createMedia(mediaConfig);
    event.setBackgroundImage(media);
    await event.save();
    return media;
};

var returnEventOrError = function(event) {
    if(!event) {
        var err = Error("Can't find event");
        err.status = 404;
        throw err;
    }
    return event;
};


module.exports = {
    createEvent: createEvent,
    getPublicEvents: getPublicEvents,
    queryEvents: queryEvents,
    getEventByID: getEventByID,
    getEventByURL: getEventByURL,
    getEventByURLAsModerator: getEventByURLAsModerator,
    getEventIfAttendee: getEventIfAttendee,
    setEventBackground: setEventBackground
};