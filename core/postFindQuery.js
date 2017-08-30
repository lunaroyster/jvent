const mongoose = require('mongoose');
const Q = require('q');
const _ = require('underscore')._;
const assert = require('chai').assert;

const Event = mongoose.model('Event');
const Post = mongoose.model('Post');

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