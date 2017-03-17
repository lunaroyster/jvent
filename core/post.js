var mongoose = require('mongoose');
var Q = require('q');

// var User = mongoose.model('User');
var eventCore = require('./event');
var urlCore = require('./url');
var collectionCore = require('./collection');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

// module.exports.createPost = function(postSettings, event, superCollection) {
//     var newPost = new Post({
//         title: postSettings.title,
//         parentEvent: event._id,
//         superCollection: superCollection._id,
//         content: {
//             text: postSettings.contentText
//         },
//         timeOfCreation: Date.now()
//     });
//     return newPost.save();
// };

module.exports.createPost = function(user, post, event) {
    return getUniquePostURL(6, event)
    .then(function(newPostUrl) {
        return collectionCore.getSuperCollectionByID(event.superCollection)
        .then(function(sc) {
            var newPost = new Post({
                title: post.title,
                parentEvent: event._id,
                url: newPostUrl,
                superCollection: sc._id,
                content: {
                    text: post.contentText
                },
                timeOfCreation: Date.now()
            });
            newPost.submitter.user = user._id;
            newPost.submitter.name = user.username;
            return newPost.save()
            .then(function(post) {
                sc.addPost(post);
                return sc.save()
                .then(function(sc) {
                    return post;
                });
            });
            //Regular Collections?
        });
    })
};

var getUniquePostURL = function(length, event) {
    return Q.fcall(function() {
        var url = urlCore.generateRandomUrl(length);
        return Post.findOne({url: url, parentEvent: event._id})
        .then(function(post) {
            if(!post) {
                return url;
            }
            else {
                return getUniquePostURL(length, event);
            }
        });
    });
};

module.exports.getEventPosts = function(event) {
    //TODO: Queries
    // Can use either supercollection or direct. Change this implementation if required.
    var postQuery = Post.find({parentEvent: event._id});
    return postQuery.exec();
};

var returnPostOrError = function(post) {
    if(!post) {
        var err = Error("Can't find post");
        err.status = 404;
        throw err;
    }
    return post;
};

module.exports.getPostByID = function(event, postID) {
    var postQuery = Post.findOne({parentEvent: event._id, _id: postID});
    return postQuery.exec()
    .then(returnPostOrError);
};

module.exports.getPostByURL = function(event, postURL) {
    var postQuery = Post.findOne({parentEvent: event._id, url: postURL});
    return postQuery.exec()
    .then(returnPostOrError);
};
