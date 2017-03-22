var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore')._;

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
        // this.find = {};
        _.each(this.find, function(finder) {
            finder.enabled = false;
        });
        return this;
    },
    location: function(location) {
        //verify location is legitimate
        this.find.location = {
            enabled: true,
            data: location
        };
        return this;
    },
    time: function(start, end) {
        //verify args are legitimate time values
        this.find.time = {
            enabled: true,
            data: {
                start: start,
                end: end
            }
        };
        return this;
    },
    organizer: function(organizer) {
        //enable org search and store provided organizer
        this.find.organizer = {
            enabled: true,
            data: organizer
        };
        return this;
    },
    genre: function() {
        var genres = Array.from(arguments);
        //verify genres exist
        this.find.genre = {
            enabled: true,
            data: genres
        };
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