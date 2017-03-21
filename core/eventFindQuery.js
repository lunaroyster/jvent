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
    limit: function(n) {
        //check if n is acceptable
        this.limit.count = n;
        return this;
    },
    page: function(n) {
        //check if acceptable.
        //Switch to offsets?
        this.limit.page = n;
        return this;
    },
    //other
    then: function() {
        //Convert to query and return promise
    }
};

module.exports.eventFindQuery = eventFindQuery;