var mongoose = require('mongoose');
// var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var SuperCollection = mongoose.model('SuperCollection');
var Event = mongoose.model('Event');

module.exports.createSuperCollection = function(event) {
    var superCollection = new SuperCollection({
        event: event
    });
    return superCollection.save();
};