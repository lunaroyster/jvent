var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore')._;
var assert = require('chai').assert;

var Event = mongoose.model('Event');

var eventFindQuery = function(query) {
    this.Event = Event;
    if(typeof query == "undefined") {
        //generate default query
        this.find = {
            location: {
                enabled: false,
                data: {}
            },
            time: {
                enabled: false,
                data: {}
            },
            organizer: {
                enabled: false,
                data: {}
            },
            genre: {
                enabled: false,
                data: {}
            },
            visibility: {
                enabled: true,
                data: "public"
            },
            // ingress: {
            //     enabled: false,
            //     data: "everyone"
            // }
        };
        this.sort = {
            enabled: false,
            time: {
                enabled: false,
                data: {
                    direction: 0
                }
            },
            rank: {
                enabled: false,
                data: {
                    type: "hot"
                }
            }
        };
        this.limit = {
            enabled: true,
            count: 25
        };
        this.field = {
            enabled: true,
            fields: []
        };
    }
    else {
        //Load query
    }
};

eventFindQuery.prototype = {
    // {
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
    visibility: function(visibility) {
        assert.include(["public", "unlisted", "private"], visibility, "Invalid visibility setting");
        this.find.visibility.enabled = true;
        this.find.visibility.data = visibility;
        return this;
    },
    ingress: function(ingress) {
        assert.include(["everyone", "link", "invite"], ingress, "Invalid ingress setting");
        this.find.ingress.enabled = true;
        this.find.ingress.data = ingress;
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
    // } Find
    // {
    byTime: function(direction) {
        //verify direction
        //Enable time sort and store provided direction
        return this;
    },
    byRank: function(rankType) {
        assert.include(["top", "new"], rankType, "Invalid rankType"); //TODO: More Ranks.
        //Enable rank sort and store provided rankType
        return this;
    },
    // } Sort
    // {
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
    // } Field
    // {
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
    // } Limit
    // {
    then: function() {
        var query = this.Event;
        var thenPromise = Q.fcall(function() {
            var queryPromises = [];
            // {
            var findQuery = {};
            // if(required) {
            //      var p = MongooseObject.find({data:data})
            //      .then(function(object) {
            //          this.find.field.data = object.data
            //          return object.event
            //      })
            //  queryPromises.push(p)
            // }
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
            // } Find
            // {
            // } Sort
            // {
            query = query.select(this.field.fields);
            // } Select
            // {
            query = query.limit(this.limit.count);
            query = query.skip(this.limit.page*this.limit.count); //HACK: DOES NOT SCALE
            // } Limit
            return Q.all(queryPromises);
        })
        .then(function() {
            return query.exec();
        });
        return thenPromise;
    }
    // } Field
};

module.exports = eventFindQuery;