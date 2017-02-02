var mongoose = require('mongoose');
var collectionCore = require('./collection');
var Event = mongoose.model('Event');

module.exports.createDefaultUserLists = function(event) {
    var visibility = event.visibility;
    var ingress = event.ingress;
    var UserLists = {};
    if(visibility=="private") {
        //Create viewer list
    }
    if(ingress=="invite") {
        //Create invite list
    }
    //Create Moderator list
    //Create Attendee list
}
