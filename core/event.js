var mongoose = require('mongoose');
var Q = require('q');
// var User = mongoose.model('User');
var urlCore = require('./url');
var collectionCore = require('./collection');
var userListCore = require('./userList');
var eventMembershipCore = require('./eventMembership');
var eventFindQuery = require('./eventFindQuery');

var Event = mongoose.model('Event');

module.exports.createEvent = function(eventSettings, user) {
    return getUniqueEventURL(6)
    .then(function(newEventURL) {
        var newEvent = new Event({
            name: eventSettings.name,
            byline: eventSettings.byline,
            description: eventSettings.description,
            visibility: eventSettings.visibility,
            ingress: eventSettings.ingress,
            comment: eventSettings.comment,
            url: newEventURL,
            timeOfCreation: Date.now()
        });
        if(eventSettings.ingress=="link") {
            newEvent.joinUrl = urlCore.generateRandomUrl(11);
        }
        newEvent.organizer = {
            user: user._id,
            name: user.username
        };
        return newEvent.save();
    })
    .then(function(event) {
        //TODO: Rewrite this abomination of a code block
        //TODO: Remove promise array and simplify as needed
        var promises = [];
        promises.push(collectionCore.createSuperCollection(event));
        promises.push(eventMembershipCore.addModerator(user, event));
        // promises.push(userListCore.createDefaultUserLists(event));
        return Q.all(promises)
        .then(function(results) {
            event.superCollection = results[0];
            // event.assignUserLists(results[1]);
        })
        .then(function() {
            return event.save();
        });
        // TODO: Remove unnecessary event save if possible.
    });
};

module.exports.getPublicEvents = function() {
    // TODO: query to select events based on time/location/rating/uploader etc
    var eventQuery = Event
    .find({visibility: "public"})
    .select('-_id name description byline url organizer.name ingress');
    return eventQuery.exec();
};

module.exports.queryEvents = function(query) {
    
};

var getUniqueEventURL = function(length) {
    return Q.fcall(function() {
        var url = urlCore.generateRandomUrl(length);
        return Event.findOne({url: url})
        .then(function(event) {
            if(!event) {
                return url;
            }
            else {
                return getUniqueEventURL(length);
            }
        });
    });
};

var returnEventOrError = function(event) {
    if(!event) {
        var err = Error("Can't find event");
        err.status = 404;
        throw err;
    }
    return event;
};

module.exports.getEventByID = function(eventID) {
    return Event.findOne({_id: eventID})
    .select('-_id name byline description url organizer.name ingress visibility timeOfCreation superCollection')
    .then(returnEventOrError);
};

module.exports.getEventByURL = function(url) {
    return Event.findOne({url: url})
    .select('name byline description url organizer.name ingress visibility timeOfCreation superCollection')
    .then(returnEventOrError);
};

module.exports.getEventByURLAsModerator = function(url) {
    return Event.findOne({url: url})
    .select('name byline description url organizer.name ingress visibility timeOfCreation roles')
    .then(returnEventOrError);
};

module.exports.getEventIfAttendee = function(user, eventID) {
    
};

