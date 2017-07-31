var mongoose = require('mongoose');
var Q = require('q');

var urlCore = require('./url');

var Comment = mongoose.model('Comment');

//Comment creation
var returnCommentOrError = function(comment) {
    if(!comment) {
        var err = Error("Can't find comment");
        err.status = 404;
        throw err;
    }
    return comment;
};

var createCommentDocument = function(commentConfig) {
    var newComment = new Comment({
        body: commentConfig.body
    });
    newComment.attachToParentComment(commentConfig.parentComment);
    newComment.setEvent(commentConfig.event);
    newComment.setPost(commentConfig.post);
    newComment.setSubmitter(commentConfig.submitter);
    return newComment;
};
var saveComment = function(comment) {
    return comment.save()
    .then(returnCommentOrError);
};
var getUniqueCommentURL = function(length, event, post) {
    return Q.fcall(function() {
        var url = urlCore.generateRandomUrl(length);
        return Comment.findOne({url: url, event: event._id, post: post._id})
        .then(function(comment) {
            if(!comment) return url;
            return getUniqueCommentURL(length, event, post);
        });
    })
};
module.exports.createComment = function(commentConfig) {
    return Q.fcall(function() {
        return getUniqueCommentURL(4, commentConfig.event, commentConfig.post)
    })
    .then(function(newCommentUrl) {
        commentConfig.url = newCommentUrl;
        var newComment = createCommentDocument(commentConfig);
        return saveComment(newComment);
    })
};

//Comment fetching

//Comment vote
