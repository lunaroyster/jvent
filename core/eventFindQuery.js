var mongoose = require('mongoose');
var Q = require('q');

var Event = mongoose.model('Event');

var eventFindQuery = function() {
    this.Event = Event;
    this.sort = {};
    this.find = {};
    this.field = {};
    this.limit = {};
};

eventFindQuery.prototype = {
    //find
    //sort
    //field
    //limit
    //other
    then: function() {
        //Convert to query and return promise
    }
};

module.exports.eventFindQuery = eventFindQuery;