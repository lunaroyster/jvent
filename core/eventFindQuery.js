var mongoose = require('mongoose');
var Q = require('q');

var Event = mongoose.model('Event');

var eventFindQuery = function() {
    this.Event = Event;
};
eventFindQuery.prototype = {
    
};

module.exports.eventFindQuery = eventFindQuery;