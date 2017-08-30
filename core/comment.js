const mongoose = require('mongoose');
const Q = require('q');

const urlCore = require('./url');

const Comment = mongoose.model('Comment');

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
        body: commentConfig.body,
        url: commentConfig.url
    });
    newComment.attachToParentComment(commentConfig.parentComment);
    newComment.setEvent(commentConfig.event);
    newComment.setPost(commentConfig.post);
    newComment.setSubmitter(commentConfig.user);
    return newComment;
};
var saveComment = function(comment) {
    return comment.save()
    .then(returnCommentOrError);
};
var getUniqueCommentURL = function(length, event, post) {
    return Q.fcall(()=> {
        var url = urlCore.generateRandomUrl(length);
        return Comment.findOne({url: url, event: event._id, post: post._id})
        .then((comment)=> {
            if(!comment) return url;
            return getUniqueCommentURL(length, event, post);
        });
    });
};
module.exports.createComment = function(commentConfig) {
    return Q.fcall(()=> {
        return getUniqueCommentURL(4, commentConfig.event, commentConfig.post);
    })
    .then((newCommentUrl)=> {
        commentConfig.url = newCommentUrl;
        if(!commentConfig.parent) return;
        return getCommentByID(commentConfig.event, commentConfig.post, commentConfig.parent)
        .then((parentComment)=> {
            commentConfig.parentComment = parentComment;
        });
    })
    .then(()=> {
        var newComment = createCommentDocument(commentConfig);
        return saveComment(newComment);
    });
};

//Comment fetching
module.exports.getComments = function(event, post) {
    var commentQuery = Comment
    .find({event: event._id, post: post._id});
    return commentQuery.exec();
};

var getCommentByID = function(event, post, commentID) {
    var commentQuery = Comment.findOne({event: event._id, post: post._id, _id: commentID});
    return commentQuery.exec()
    .then(returnCommentOrError);
};
module.exports.getCommentByID = getCommentByID;

module.exports.getCommentByURL = function(event, post, commentURL) {
    var commentQuery = Comment.findOne({event: event._id, post: post._id, url: commentURL});
    return commentQuery.exec()
    .then(returnCommentOrError);
};
//Comment vote
