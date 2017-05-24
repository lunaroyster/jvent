var mongoose = require('mongoose');
var Q = require('q');

// var User = mongoose.model('User');
var eventCore = require('./event');
var urlCore = require('./url');
var collectionCore = require('./collection');
var mediaCore = require('./media');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');
var Vote = mongoose.model('Vote');

// Post Creation
module.exports.createPostWithMedia = function(postConfig, mediaConfig) {
    return Q.fcall(function() {
        return mediaCore.createMedia(mediaConfig);
    })
    .then(function(mediaDelegate) {
        return [createPost(postConfig, mediaDelegate), mediaDelegate];
    });
};
module.exports.createPostWithoutMedia = function(postConfig) {
    return Q.fcall(function() {
        return [createPost(postConfig), undefined];
    });
};

var createPostDocument = function(postConfig, mediaDelegate) {
    var newPost = new Post({
        title: postConfig.title,
        url: postConfig.url,
        content: {
            text: postConfig.content.text
        },
        timeOfCreation: Date.now()
    });
    newPost.setEvent(postConfig.event);
    newPost.setSubmitter(postConfig.user);
    if(mediaDelegate) newPost.setMedia(mediaDelegate);
    console.log(newPost);
    return newPost;
};
var savePost = function(post) {
    return post.save()
    .then(returnPostOrError);
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
var createPost = function(postConfig, mediaDelegate) {
    return getUniquePostURL(6, postConfig.event)
    .then(function(newPostUrl) {
        postConfig.url = newPostUrl;
        return collectionCore.getSuperCollectionByID(postConfig.event.superCollection)
        .then(function(sc) {
            var newPost = createPostDocument(postConfig, mediaDelegate);
            newPost.sc = sc;
            return savePost(newPost)
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
module.exports.createPost = createPost;

// Post Retrieval
module.exports.getEventPosts = function(event) {
    //TODO: Queries
    // Can use either supercollection or direct. Change this implementation if required.
    var postQuery = Post.find({parentEvent: event._id});
    return postQuery.exec();
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
var returnPostOrError = function(post) {
    if(!post) {
        var err = Error("Can't find post");
        err.status = 404;
        throw err;
    }
    return post;
};

// Post Find Query
var postFindQuery = function() {
    //TODO
};
module.exports.postFindQuery = postFindQuery;

// Post Vote
module.exports.vote = function(user, post, direction) {
    return Q.fcall(function() {
        return Vote.findOne({user: user._id, post: post._id})
        .then(function(vote) {
            if(vote) {
                return vote;
            }
            else {
                var newVote = new Vote({});
                newVote.setUser(user);
                newVote.setPost(post);
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
            return Q.fcall(function() {
                if(change) {
                    return vote.save()
                    .then(function(vote) {
                        if(!vote) throw Error("Failed to vote.");
                        return;
                    });
                }
            })
            .then(function() {
                return {
                    change: change,
                    direction: vote.direction
                };
            })
        });
    });
};
