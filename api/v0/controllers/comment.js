const Q = require('q');
const assert = require('chai').assert;

const commentCore = require('../../../core/comment');
const eventMembershipCore = require('../../../core/eventMembership');
const commentRequestSchema = require('../requests').comment;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const EventMembership = eventMembershipCore.EventMembership;

// /comment/
var checkCreateCommentPrivilege = function(req) {
    return Q.fcall(()=> {
        if(!req.user.privileges.createPost) throw new Error("Bad privileges");
        return;
    })
    .then(()=> {
        return req.getEventMembership()
        .then((eventMembership)=> {
            assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
            return;
        });
    });
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
module.exports.createComment = function(req, res) {
    Q.fcall(()=> {
        return validateRequest(req, commentRequestSchema.createComment);
    })
    .then(()=> {
        return checkCreateCommentPrivilege(req);
    })
    .then(()=> {
        var commentConfig = createCommentTemplateFromRequest(req, req.body.comment);
        return commentCore.createComment(commentConfig);
    })
    .then((comment)=> {
        var state = {
            status: "Created",
            comment: {
                url: comment.url
            }
        };
        res.status(201).json(state);
        return;
    })
    .catch((error)=> {
        var err = packError(error);
        console.log(error.stack);
        res.status(400).json(err);
    });
};

module.exports.getComments = function(req, res) {
    Q.fcall(()=> {
        return commentCore.getComments(req.event, req.post)
    })
    .then((comments)=> {
        res.status(200).json({comments: comments});
    })
    .catch((error)=> {
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
    .then((comment)=> {
        req.comment = comment;
        next();
    });
};
