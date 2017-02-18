var mongoose = require('mongoose');
var Q = require('q');
// var User = mongoose.model('User');
var urlCore = require('../../../core/url');
var collectionCore = require('./collection');
var userListCore = require('./userList');
var Event = mongoose.model('Event');

module.exports.createEvent = function(eventSettings) {
    var newEvent = new Event({
        name: eventSettings.name,
        byline: eventSettings.byline,
        description: eventSettings.description,
        visibility: eventSettings.visibility,
        ingress: eventSettings.ingress,
        url: urlCore.generateRandomUrl(6),
        timeOfCreation: Date.now()
    });
    
    newEvent.organizer.user = eventSettings.user._id;
    newEvent.organizer.name = eventSettings.user.username;
    return newEvent.save()
    .then(function(event) {
        var promises = [];
        promises.push(collectionCore.createSuperCollection(event));
        promises.push(userListCore.createDefaultUserLists(event));
        return Q.all(promises)
        .then(function(results) {
            event.superCollection = results[0];
            event.assignUserLists(results[1]);
        })
        .then(function() {
            return event.save();
        });
        // TODO: Remove unnecessary event save if possible.
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
