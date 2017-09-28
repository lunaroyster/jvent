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
    let newPost = new Post({
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
var savePost = async function(post) {
    return returnPostOrError(await post.save());
};
var getUniquePostURL = async function(length, event) {
    let url = urlCore.generateRandomUrl(length);
    let post = await Post.findOne({url: url, event: event._id});
    if(!post) {
        return url;
    }
    else {
        return await getUniquePostURL(length, event);
    }
};
var _createPost = async function(postConfig, mediaDelegate) {
    postConfig.url = await getUniquePostURL(6, postConfig.event);
    
    let sc = await collectionCore.getSuperCollectionByID(postConfig.event.superCollection);
    
    let newPost = createPostDocument(postConfig, mediaDelegate);
    newPost.sc = sc;
    
    let post = await savePost(newPost);
    sc.addPost(post);
    await vote(postConfig.user, post, 1);
    await sc.save();
    return post;
};
var createPost = async function(postConfig, mediaConfig) {
    let mediaDelegate;
    if(mediaConfig) {
        mediaDelegate = await mediaCore.createMedia(mediaConfig);
    }
    return [_createPost(postConfig, mediaDelegate), mediaDelegate];
};

// Post Retrieval
var getEventPosts = async function(event) {
    //TODO: Queries
    // Can use either supercollection or direct. Change this implementation if required.
    var postQuery = Post.find({event: event._id});
    return postQuery.exec();
};
var getRankedEventPosts = async function(event, rank) {
    if(rank=="top") return postRankQuery.topPosts(event);
    if(rank=="hot") return postRankQuery.hotPosts(event);
};
var getPostByID = async function(event, postID) {
    var postQuery = Post.findOne({event: event._id, _id: postID}).populate('media.media');
    return returnPostOrError(await postQuery.exec());
};
var getPostByURL = async function(event, postURL) {
    var postQuery = Post.findOne({event: event._id, url: postURL}).populate('media.media');
    return returnPostOrError(await postQuery.exec());
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

// Post Vote
var vote = async function(user, post, direction) {
    var getOrInitializeVote = async function(user, post) {
        let vote = await Vote.findOne({user: user._id, post: post._id});
        if(vote) {
            return vote;
        }
        else {
            var newVote = new Vote({});
            newVote.setUser(user);
            newVote.setPost(post);
            return newVote;
        }
    };
    var changeVote = function(vote, direction) {
        let changeResult;
        if(direction==1) {
            changeResult = vote.upvote();
        }
        else if(direction==0) {
            changeResult = vote.unvote();
        }
        else if(direction==-1) {
            changeResult = vote.downvote();
        }
        return changeResult;
    };
    
    let vote = await getOrInitializeVote(user, post);
    let changeResult = changeVote(vote, direction);
    if(changeResult) {
        vote = await vote.save();
        if(!vote) throw Error("Failed to vote.");
    }
    return {
        change: changeResult,
        direction: vote.direction
    };
};

module.exports = {
    createPost: createPost,
    getEventPosts: getEventPosts,
    getRankedEventPosts: getRankedEventPosts,
    getPostByID: getPostByID,
    getPostByURL: getPostByURL,
    postFindQuery: postFindQuery,
    vote: vote
};