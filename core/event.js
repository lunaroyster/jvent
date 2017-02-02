var mongoose = require('mongoose');
// var User = mongoose.model('User');
var collectionCore = require('./collection');
var Event = mongoose.model('Event');

module.exports.createEvent = function(eventSettings) {
    var newEvent = new Event({
        name: eventSettings.name,
        byline: eventSettings.byline,
        description: eventSettings.description,
        visibility: eventSettings.visibility,
        ingress: eventSettings.ingress,
        url: eventSettings.url,
        timeOfCreation: Date.now()
    });
    newEvent.organizer.user = eventSettings.user._id;
    newEvent.organizer.name = eventSettings.user.username;
    return newEvent.save()
    .then(function(event) {
        return collectionCore.createSuperCollection(event)
        .then(function(sc) {
            event.superCollection = sc;
            return;
        })
        .then(function() {
            return userListCore.createUserLists(event)
            .then(function(userLists) {
                event.assignUserLists(userLists);
                return event.save()
            })
        })
        // TODO:
        // Remove unnecessary event save if possible.
        // Use a promise array for userListCore
    })
    .fail(function(error) {
        return error;
    });
};

// TODO: query to select events based on time/location/rating/uploader etc

module.exports.getPublicEvents = function() {
    // TODO: query to select events based on time/location/rating/uploader etc
    var eventQuery = Event.find({visibility: "public"}).select('-_id name description byline url organizer.name ingress');
    return eventQuery.exec();
};

module.exports.getEventByID = function(eventID) {
    var eventQuery = Event.findOne({_id: eventID});
    return eventQuery.exec();
};

module.exports.getEventByURL = function(url) {
    var eventQuery = Event.findOne({url: url});
    return eventQuery.exec();
};

module.exports.getEventIfAttendee = function(eventID, user) {

};
