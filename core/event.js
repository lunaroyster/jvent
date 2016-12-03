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
    })
};