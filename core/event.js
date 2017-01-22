var mongoose = require('mongoose');
// var User = mongoose.model('User');
var collectionCore = require('./supercollection')
var Event = mongoose.model('Event');

module.exports.createEvent = function(eventSettings, callback) {
    var newEvent = new Event({
        name: eventSettings.name,
        byline: eventSettings.byline,
        description: eventSettings.description,
        visibility: eventSettings.visibility,
        ingress: eventSettings.ingress,
        timeOfCreation: Date.now()
    });
    newEvent.organizer.user = eventSettings.user._id;
    newEvent.organizer.name = eventSettings.user.username;
    newEvent.save(function(err) {
        if (!err) {
            var state = {
                status: "Created",
                event: newEvent._id
            };
            callback(state);
        }
        else {
            var errState = {
                status: "Error",
                error: err
            };
            callback(errState);
        }
    });
};

module.exports.createEvent = function(eventSettings) {
    var newEvent = new Event({
        name: eventSettings.name,
        byline: eventSettings.byline,
        description: eventSettings.description,
        visibility: eventSettings.visibility,
        ingress: eventSettings.ingress,
        timeOfCreation: Date.now()
    });
    newEvent.organizer.user = eventSettings.user._id;
    newEvent.organizer.name = eventSettings.user.username;
    return newEvent.save()
    .then(function(event) {
        collectionCore.createSuperCollection(event)
        .then(function(sc) {
            event.superCollection = sc;
            return event.save();
        });
        // TODO:
        // userListCore.createUserList(event)
        // Use a promise array for userListCore
    })
    // .fail(function(error) {
        
    // });
};

// TODO: query to select events based on time/location/rating/uploader etc
module.exports.getEvents = function(callback) {
    var eventQuery = Event.find().select('-posts -organizer.user -timeOfCreation -__v');
    eventQuery.exec(function(err, events) {
        // callback(err, events);
        if (!err) {
            // var state = {
            //     status: "Success",
            //     eventCount: events.length
            // };
            // callback(state, events);
            callback(null, events);
        }
        else {
            // var errState = {
            //     status: "Failed",
            //     error: err
            // };
            // callback(errState);
            callback(err, null);
        }
    })
}

// TODO: query to select events based on time/location/rating/uploader etc
module.exports.getEvents = function(callback) {
    var eventQuery = Event.find().select('-posts -organizer.user -timeOfCreation -__v');
    return eventQuery.exec();
};

module.exports.getEventByID = function(eventID, callback) {
    var eventQuery = Event.findOne({_id: eventID});
    eventQuery.exec(function(err, event) {
        callback(err, event);
    });
};

