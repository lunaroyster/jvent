var mongoose = require('mongoose');
// var User = mongoose.model('User');
var Event = mongoose.model('Event');

// Information in -> Queries DB -> Object out
module.exports.createEvent = function(eventSettings, callback) {
    var newEvent = new Event({
        name: eventSettings.name,
        byline: eventSettings.byline,
        description: eventSettings.description,
        privacy: eventSettings.privacy,
        timeOfCreation: Date.now()
    });
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

// TODO: query to select events based on time/location/rating/uploader etc
module.exports.getEvents = function(callback) {
    var eventQuery = Event.find().select('-posts -__v');
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

module.exports.getEventByID = function(eventID, callback) {
    var eventQuery = Event.findOne({_id: eventID});
    eventQuery.exec(function(err, event) {
        callback(err, event);
    });
};

