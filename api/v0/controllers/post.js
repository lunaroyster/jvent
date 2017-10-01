const postCore = require('../../../core/post');
const assert = require('chai').assert;

// const eventCore = require('../../../core/event');
const userListCore = require('../../../core/userList');
const mediaCore = require('../../../core/media');
const eventMembershipCore = require('../../../core/eventMembership');
const postRequestSchema = require('../requests').post;

const postRankQueryCore = require('../../../core/postRankQuery');

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const asyncWrap = common.asyncWrap;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;
const EventMembership = eventMembershipCore.EventMembership;

// /post/
var checkCreatePostPrivilege = async function(req) {
    if(!req.user.privileges.createPost) throw new Error("Bad privileges");
    let eventMembership = await req.getEventMembership();
    assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
};
var createPostTemplateFromRequest = function(req, post) {
    if(!post) return;
    return {
        title: post.title,
        content: {
            text: post.content.text,
            link: post.content.link
        },
        user: req.user,
        event: req.event
    };
};
var createPost = async function(req, res) {
    try {
        await validateRequest(req, postRequestSchema.createPost);
        await checkCreatePostPrivilege(req);
        let postTemplate = await createPostTemplateFromRequest(req, req.body.post);
        let mediaTemplate = undefined;
        if(req.body.media) mediaTemplate = createMediaTemplateFromRequest(req, req.body.media);
        let [postPromise, mediaPromise] = await postCore.createPost(postTemplate, mediaTemplate);
        let post = await postPromise;
        let media = await mediaPromise;
        let state = {
            status: "Created",
            post: {url: post.url}
        };
        if(media) {
            state.media = {url: media.url};
        }
        res.status(201).json(state);
    }
    catch (error) {
        var err = packError(error);
        // console.log(error.stack);
        res.status(400).json(err);
    }
};

var getEventPosts = async function(req, res) {
    try {
        let rankType = req.query.rank || "hot";
        assert.include(["hot", "top"], rankType, "Not a valid rank");
        let posts = await postCore.getRankedEventPosts(req.event, rankType);
        res.status(200).json({posts: posts});
    }
    catch (error) {
        //TODO
        res.status(400).json(error.message);
    }
};

// /post/:postURL

var getPostByID = async function(req, res) {
    // Check user privilege
    // Perhaps check querystring (for comment sorting maybe?)
    let post = await postCore.getPostByID(req.event._id, req.params.postURL);
    res.status(200).json(post);
};
var getPost = function(req, res) {
    res.status(200).json({post: req.post});
};

var appendPostURL = function(req, res, next) {
    req.postURL = req.params.postURL;
    next();
};
var appendPost = async function(req, res, next) {
    let post = await postCore.getPostByURL(req.event, req.postURL);
    req.post = post;
    next();
};

// /post/:postURL/vote

var vote = async function(req, res) {
    try {
        await validateRequest(req, postRequestSchema.vote);
        let voteResponse = await postCore.vote(req.user, req.post, req.body.direction);
        if(voteResponse.change) return res.status(200).json(voteResponse);
        res.status(400).json(voteResponse);
    }
    catch (error) {
        var err = packError(error);
        res.status(400).json(err);
    }
};

module.exports = {
    createPost: asyncWrap(createPost),
    getEventPosts: asyncWrap(getEventPosts),
    getPostByID: asyncWrap(getPostByID),
    getPost: asyncWrap(getPost),
    appendPostURL: appendPostURL,
    appendPost: appendPost,
    vote: asyncWrap(vote)
};