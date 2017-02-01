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
            return event.save();
        });
        // TODO:
        // userListCore.createUserList(event)
        // Use a promise array for userListCore
    })
    .fail(function(error) {
        return error;
    });
};

// TODO: query to select events based on time/location/rating/uploader etc

module.exports.getEvents = function() {
    // TODO: query to select events based on time/location/rating/uploader etc
    var eventQuery = Event.find().select('-posts -organizer.user -timeOfCreation -__v');
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