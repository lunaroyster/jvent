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
};