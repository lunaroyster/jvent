var Q = require('q');
var assert = require('chai').assert;

var commentCore = require('../../../core/comment');
var eventMembershipCore = require('../../../core/eventMembership');
var commentRequestSchema = require('../requests').comment;

var common = require('./common');
var validateRequest = common.validateRequest;
var packError = common.packError;
var EventMembership = eventMembershipCore.EventMembership;

// /comment/
var checkCreateCommentPrivilege = function(req) {
    return Q.fcall(function() {
        if(!req.user.privileges.createPost) throw new Error("Bad privileges");
        return;
    })
    .then(function() {
        return req.getEventMembership()
        .then(function(eventMembership) {
            assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
            return;
        });
    });
};
var createCommentTemplateFromRequest = function(req, comment) {
    if(!comment) return;
    return {
        body: comment.body,
        user: req.user,
        event: req.event,
        post: req.post
    };
};
module.exports.createComment = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, commentRequestSchema.createComment);
    })
    .then(function() {
        return checkCreateCommentPrivilege(req);
    })
    .then(function() {
        var commentTemplate = createCommentTemplateFromRequest(req, req.body.comment);
        return commentCore.createComment(commentTemplate);
    })
    .then(function(comment) {
        var state = {
            status: "Created",
            comment: {
                url: comment.url
            }
        };
        res.status(201).json(state);
        return;
    })
    .catch(function(error) {
        var err = packError(error);
        console.log(error.stack);
        res.status(400).json(err);
    });
};

module.exports.getComments = function(req, res) {
    Q.fcall(function() {
        return commentCore.getComments(req.event, req.post)
    })
    .then(function(comments) {
        res.status(200).json({comments: comments});
    })
    .catch(function(error) {
        res.status(400).json(error.message);
    });
};

// /comment/:commentURL
module.exports.getCommentByURL = function(req, res) {
    var responseObject = {};
    responseObject.comment = req.comment;
    res.status(200).json(responseObject);
};

module.exports.updateCommentByURL = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deleteCommentByURL = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.appendCommentURL = function(req, res, next) {
    req.commentURL = req.params.commentURL;
    next();
}
module.exports.appendComment = function(req, res, next) {
    commentCore.getCommentByURL(req.event, req.post, req.commentURL)
    .then(function(comment) {
        req.comment = comment;
        next();
    });
};
