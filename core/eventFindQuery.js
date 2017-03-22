var mongoose = require('mongoose');
var Q = require('q');

var Event = mongoose.model('Event');

var eventFindQuery = function() {
    this.Event = Event;
    this.find = {};
    this.sort = {};
    this.limit = {};
    this.field = {};
};

eventFindQuery.prototype = {
    //find
    all: function() {
        //reset finds
        return this;
    },
    location: function(location) {
        //verify location is legitimate
        //enable location search and store provided loc
        return this;
    },
    time: function(start, end) {
        //verify args are legitimate time values
        //enable time search and store provided time
        return this;
    },
    organizer: function(organizer) {
        //enable org search and store provided organizer
        return this;
    },
    genre: function(genre) {
        //verify genre exists and store provided genre
        return this;
    },
    //sort
    byTime: function(direction) {
        //verify direction
        //Enable time sort and store provided direction
        return this;
    },
    byRank: function(rankType) {
        //Verify rankType is real
        //Enable rank sort and store provided rankType
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
    noSelect: function() {
        //TODO: complete
        this.field.fields = [];
        return this;
    },
    //limit
    limit: function(n) {
        //check if n is valid
        this.limit.count = n;
        return this;
    },
    page: function(n) {
        //check if n is valid.
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