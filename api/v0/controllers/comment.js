const assert = require('chai').assert;

const commentCore = require('../../../core/comment');
const eventMembershipCore = require('../../../core/eventMembership');
const commentRequestSchema = require('../requests').comment;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const asyncWrap = common.asyncWrap;
const EventMembership = eventMembershipCore.EventMembership;

// /comment/
var checkCreateCommentPrivilege = async function(req) {
    if(!req.user.privileges.createPost) throw new Error("Bad privileges");
    let eventMembership = req.getEventMembership();
    assert(eventMembership.can("createComment"), "User doesn't have sufficient privileges"); 
};
var createCommentTemplateFromRequest = function(req, comment) {
    if(!comment) return;
    return {
        body: comment.body,
        parent: comment.parent,
        user: req.user,
        event: req.event,
        post: req.post
    };
};
var createComment = async function(req, res) {
    try {
        await validateRequest(req, commentRequestSchema.createComment);
        await checkCreateCommentPrivilege(req);
        var commentConfig = createCommentTemplateFromRequest(req, req.body.comment);
        let comment = await commentCore.createComment(commentConfig);
        var state = {
            status: "Created",
            comment: {url: comment.url}
        };
        res.status(201).json(state);
    }
    catch (error) {
        var err = packError(error);
        console.log(error.stack);
        res.status(400).json(err);
    }
};

var getComments = async function(req, res) {
    try {
        let comments = await commentCore.getComments(req.event, req.post);
        res.status(200).json({comments: comments});
    }
    catch (error) {
        res.status(400).json(error.message);
    }
};

// /comment/:commentURL
var getCommentByURL = function(req, res) {
    res.status(200).json({comment: req.comment});
};

var updateCommentByURL = function(req, res) {
    res.json(req);
    res.send();
};

var deleteCommentByURL = function(req, res) {
    res.json(req);
    res.send();
};

var appendCommentURL = function(req, res, next) {
    req.commentURL = req.params.commentURL;
    next();
};
var appendComment = async function(req, res, next) {
    req.comment = await commentCore.getCommentByURL(req.event, req.post, req.commentURL);
    next();
};

module.exports = {
    createComment: asyncWrap(createComment),
    getComments: asyncWrap(getComments),
    getCommentByURL: getCommentByURL,
    updateCommentByURL: updateCommentByURL,
    deleteCommentByURL: deleteCommentByURL,
    appendCommentURL: appendCommentURL,
    appendComment: asyncWrap(appendComment)
};