var mongoose = require('mongoose');
var Q = require('q');

// var User = mongoose.model('User');
var eventCore = require('./event');
var urlCore = require('./url');
var collectionCore = require('./collection');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');
var Vote = mongoose.model('Vote');

module.exports.createPost = function(user, post, event) {
    return getUniquePostURL(6, event)
    .then(function(newPostUrl) {
        return collectionCore.getSuperCollectionByID(event.superCollection)
        .then(function(sc) {
            var newPost = createPost(user, post, event);
            newPost.sc = sc;
            savePost(newPost)
            .then(function(post) {
                sc.addPost(post);
                return sc.save()
                .then(function(sc) {
                    return post;
                });
            });
            //Regular Collections?
        });
    });
};

var createPost = function(user, post, event) {
    var newPost = new Post({
        title: post.title,
        url: post.url,
        content: {
            text: post.contentText,
            link: post.link
        },
        timeOfCreation: Date.now()
    });
    newPost.setEvent(event);
    newPost.setSubmitter(user);
    return newPost;
};

var savePost = function(post) {
    return post.save()
    .then(returnPostOrError);
};

var returnPostOrError = function(post) {
    if(!post) {
        var err = Error("Can't find post");
        err.status = 404;
        throw err;
    }
    return post;
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

var postFindQuery = function() {
    
};

module.exports.postFindQuery = postFindQuery;


module.exports.vote = function(user, post, direction) {
    return Q.fcall(function() {
        return Vote.findOne({user: user._id, post: post._id})
        .then(function(vote) {
            if(vote) {
                return vote;
            }
            else {
                var newVote = new Vote({
                    user: user._id,
                    post: post._id
                });
                return newVote;
            }
        });
    })
    .then(function(vote) {
        return Q.fcall(function() {
            if(direction==1) {
                return vote.upvote();
            }
            else if(direction==0) {
                return vote.unvote();
            }
            else if(direction==-1) {
                return vote.downvote();
            }
        })
        .then(function(change) {
            if(change) {
                return vote.save()
                .then(function(vote) {
                    if(vote) {
                        return true;
                    }
                });
            }
            else {
                return false;
            }
        });
    });
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
