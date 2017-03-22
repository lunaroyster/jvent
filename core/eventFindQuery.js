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
    all: function() {
        return this;
    },
    location: function(location) {
        return this;
    },
    time: function(start, end) {
        return this;
    },
    organizer: function(organizer) {
        return this;
    },
    genre: function(genre) {
        return this;
    },
    //sort
    byTime: function(direction) {
        return this;
    },
    byRank: function() {
        return this;
    },
    //field
    fields: function() {
        this.field.fields = Array.from(arguments);
        return this;
    },
    addFields: function() {
        //Check dups
        this.field.fields.push(Array.from(arguments));
        return this;
    },
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
        var query = this.Event;
        //find
        //sort
        //field
        query = query.select(this.field.fields);
        return query.exec();
    }
};

module.exports.eventFindQuery = eventFindQuery;