var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore')._;
var assert = require('chai').assert;

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
        assert.typeOf(start, 'Date');
        assert.typeOf(end, 'Date');
        assert(end>start, "The end date must be after the start date");
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
        this.field.enabled = true;
        this.field.fields = Array.from(arguments);
        return this;
    },
    addFields: function() {
        //Check for valid fields
        var fields = Array.from(arguments);
        this.field.fields = _.union(this.field.fields, fields);
        this.field.enabled = true;
        return this;
    },
    noSelect: function() {
        this.field.enabled = false;
        this.field.fields = [];
        return this;
    },
    //limit
    limit: function(n) {
        assert.isNumber(n);
        this.limit.count = n;
        return this;
    },
    page: function(n) {
        assert.isNumber(n);
        //Switch to offsets?
        this.limit.page = n;
        return this;
    },
    //other
    then: function() {
        var query = this.Event;
        //find
        var findQuery = {};
        if(this.find.time.enabled) {
            findQuery["timeOfCreation"] = {
                $gte: this.find.time.data.start,
                $lt: this.find.time.data.end
            };
        }
        if(this.find.organizer.enabled) {
            findQuery["organizer.name"] = this.find.organizer.data;
        }
        if(this.find.location.enabled) {
            
        }
        if(this.find.genre.enabled) {
            
        }
        query = query.find(findQuery);
        //sort
        
        //field
        query = query.select(this.field.fields);
        //limit
        query = query.limit(this.limit.count);
        query = query.skip(this.limit.page*this.limit.count); //HACK: DOES NOT SCALE
        return query.exec();
    }
};

module.exports.eventFindQuery = eventFindQuery;