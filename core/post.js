var mongoose = require('mongoose');
// var User = mongoose.model('User');
var eventCore = require('./event');
var collectionCore = require('./collection');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

module.exports.createPost = function(postSettings, eventID, callback) {
    var newPost = new Post({
        title: postSettings.title,
        parentEvent: eventID,
        content: {
            text: postSettings.contentText
        },
        timeOfCreation: Date.now()
    });
    var eventQuery = Event.findOne({_id:eventID});
    eventQuery.exec(function(err, event) {
        if (!err) {
            newPost.save(function(error) {
                event.posts.push(mongoose.Types.ObjectId(newPost._id));
                event.save();
                if (!error) {
                    var state = {
                        status: "Created",
                        event: newPost.parentEvent,
                        post: newPost._id
                    };
                    callback(state);
                }
                else {
                    var errState = {
                        status: "Error",
                        error: error
                    };
                    callback(errState);
                }
            });
        }
        else {
            var errState = {
                status: "Error",
                error: err
            };
            callback(errState);
        }
    });
};

module.exports.createPost = function(postSettings, event, superCollection) {
    var newPost = new Post({
        title: postSettings.title,
        parentEvent: event._id,
        superCollection: superCollection._id,
        content: {
            text: postSettings.contentText
        },
        timeOfCreation: Date.now()
    });
    return newPost.save();
};

// TODO: query to select posts based on time/location/rating/poster etc
module.exports.getPosts = function(eventID, callback) {
    var eventQuery = Event.findOne({_id: eventID});
    eventQuery.exec(function(err, event) {
        if(!err) {
          var postQuery = Post.find({'_id':{$in:event.posts}});
          postQuery.exec(function(error, posts) {
              if(!error) {
                  callback(null, posts);
              }
          });
        }
    });
};

module.exports.getPosts = function(eventID) {
    return collectionCore.findSuperCollection(eventID)
    .then(function(superCollection) {
        var postQuery = Post.find({'_id':{$in:superCollection.posts}});
        return postQuery.exec();
    });
};

module.exports.getPostByID = function(eventID, postID, callback) {
    var eventQuery = Event.findOne({_id: eventID});
    eventQuery.exec(function(err, event) {
        if (!err) {
            var postQuery = Post.findOne({_id: postID});
            postQuery.exec(function(error, post) {
                if(!error) {
                    callback(null, post);
                } 
            });
        }
    });
};

module.exports.getPostByID = function(eventID, postID) {
    var postQuery = Post.findOne({parentEvent: eventID, _id: postID});
    return postQuery.exec();
};