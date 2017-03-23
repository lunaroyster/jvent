var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore')._;
var assert = require('chai').assert;

var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

var postFindQuery = function(event) {
    this.Post = Post;
    this.Event = Event;
    this.contextEvent = event;
};

postFindQuery.prototype = {
    //find
    //sort
    //field
    //limit
    //other
    then: function() {
        
    }
};

module.exports = postFindQuery;