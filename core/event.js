var mongoose = require('mongoose');
var Q = require('q');
// var User = mongoose.model('User');
var urlCore = require('./url');
var collectionCore = require('./collection');
var userListCore = require('./userList');
var eventMembershipCore = require('./eventMembership');
var eventFindQuery = require('./eventFindQuery');
var mediaCore = require('./media');

var Event = mongoose.model('Event');

// Create Event
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
var saveEvent = function(event) {
    return event.save()
    .then(returnEventOrError);
};
var createEvent = function(eventConfig) {
    var user = eventConfig.user;
    return getUniqueEventURL(6)
    .then(function(newEventURL) {
        eventConfig.url = newEventURL;
        var newEvent = createEventDocument(eventConfig, user);
        return saveEvent(newEvent);
        // TODO: Remove unnecessary event save if possible.
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
    });
};
module.exports.createEvent = function(eventConfig, mediaConfig) {
    // return Q.fcall(function() {
    //     if(mediaConfig) {
    //         return mediaCore.createMedia(mediaConfig);
    //     }
    // })
    // .then(function(mediaDelegate) {
    //     // return [createEvent(eventConfig, mediaDelegate), mediaDelegate];
    //     return createEvent(eventConfig, mediaDelegate);
    // })
    return createEvent(eventConfig);
}

// Get Events
module.exports.getPublicEvents = function() {
    // TODO: query to select events based on time/location/rating/uploader etc
    var eventQuery = Event
    .find({visibility: "public"})
    .populate('backgroundImage')
    .select('-_id name description byline url organizer.name ingress backgroundImage');
    return eventQuery.exec();
};
module.exports.queryEvents = function(query) {
    //TODO
};

// Get Event
module.exports.getEventByID = function(eventID) {
    return Event.findOne({_id: eventID})
    .populate('backgroundImage')
    .select('-_id name byline description url organizer.name ingress visibility timeOfCreation superCollection backgroundImage')
    .then(returnEventOrError);
};
module.exports.getEventByURL = function(url) {
    return Event.findOne({url: url})
    .populate('backgroundImage')
    .select('name byline description url organizer.name ingress visibility timeOfCreation superCollection backgroundImage')
    .then(returnEventOrError);
};
module.exports.getEventByURLAsModerator = function(url) {
    return Event.findOne({url: url})
    .populate('backgroundImage')
    .select('name byline description url organizer.name ingress visibility timeOfCreation roles backgroundImage')
    .then(returnEventOrError);
};
module.exports.getEventIfAttendee = function(user, eventID) {

};

module.exports.setEventBackground = function(event, mediaConfig) {
    return Q.fcall(function() {
        return mediaCore.createMedia(mediaConfig);
    })
    .then(function(media) {
        event.setBackgroundImage(media);
        return event.save()
        .then(function(event) {
            return media;
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
