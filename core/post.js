const mongoose = require('mongoose');
const Q = require('q');

// const User = mongoose.model('User');
const eventCore = require('./event');
const urlCore = require('./url');
const collectionCore = require('./collection');
const mediaCore = require('./media');
const postRankQuery = require('./postRankQuery');

const Event = mongoose.model('Event');
const Post = mongoose.model('Post');
const Vote = mongoose.model('Vote');

// Post Creation
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
    return newPost;
};
var savePost = function(post) {
    return post.save()
    .then(returnPostOrError);
};
var getUniquePostURL = function(length, event) {
    return Q.fcall(()=> {
        var url = urlCore.generateRandomUrl(length);
        return Post.findOne({url: url, event: event._id})
        .then((post)=> {
            if(!post) return url;
            return getUniquePostURL(length, event);
        });
    });
};
var createPost = function(postConfig, mediaDelegate) {
    return getUniquePostURL(6, postConfig.event)
    .then((newPostUrl)=> {
        postConfig.url = newPostUrl;
        return collectionCore.getSuperCollectionByID(postConfig.event.superCollection)
        .then((sc)=> {
            var newPost = createPostDocument(postConfig, mediaDelegate);
            newPost.sc = sc;
            return savePost(newPost)
            .then((post)=> {
                sc.addPost(post);
                var promises = [];
                promises.push(vote(postConfig.user, post, 1));
                promises.push(sc.save());
                return Q.all(promises)
                .then(()=> {
                    return post;
                });
            });
            //Regular Collections?
        });
    });
};
module.exports.createPost = function(postConfig, mediaConfig) {
    return Q.fcall(()=> {
        if(mediaConfig) {
            return mediaCore.createMedia(mediaConfig);
        }
    })
    .then((mediaDelegate)=> {
        return [createPost(postConfig, mediaDelegate), mediaDelegate];
    });
}

// Post Retrieval
module.exports.getEventPosts = function(event) {
    //TODO: Queries
    // Can use either supercollection or direct. Change this implementation if required.
    var postQuery = Post.find({event: event._id});
    return postQuery.exec();
};
module.exports.getRankedEventPosts = function(event, rank) {
    return Q.fcall(()=> {
        if(rank=="top") return postRankQuery.topPosts(event);
        if(rank=="hot") return postRankQuery.hotPosts(event);
    });
};
module.exports.getPostByID = function(event, postID) {
    var postQuery = Post.findOne({event: event._id, _id: postID}).populate('media.media');
    return postQuery.exec()
    .then(returnPostOrError);
};
module.exports.getPostByURL = function(event, postURL) {
    var postQuery = Post.findOne({event: event._id, url: postURL}).populate('media.media');
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
var vote = function(user, post, direction) {
    return Q.fcall(()=> {
        return Vote.findOne({user: user._id, post: post._id})
        .then((vote)=> {
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
    .then((vote)=> {
        return Q.fcall(()=> {
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
        .then((change)=> {
            return Q.fcall(()=> {
                if(change) {
                    return vote.save()
                    .then((vote)=> {
                        if(!vote) throw Error("Failed to vote.");
                        return;
                    });
                }
            })
            .then(()=> {
                return {
                    change: change,
                    direction: vote.direction
                };
            })
        });
    });
};
module.exports.vote = vote;
