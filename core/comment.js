const mongoose = require('mongoose');

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
var saveComment = async function(comment) {
    return returnCommentOrError(await comment.save());
};
var getUniqueCommentURL = async function(length, event, post) {
    let url = urlCore.generateRandomUrl(length);
    let comment = await Comment.findOne({url: url, event: event._id, post: post._id});
    if(!comment) return url;
    return getUniqueCommentURL(length, event, post);
};
var createComment = async function(commentConfig) {
    commentConfig.url = await getUniqueCommentURL(4, commentConfig.event, commentConfig.post);
    if(commentConfig.parent) {
        let parentComment = await getCommentByID(commentConfig.event, commentConfig.post, commentConfig.parent);
        commentConfig.parentComment = parentComment;
    }
    let newComment = createCommentDocument(commentConfig);
    return saveComment(newComment);
};

//Comment fetching
var getComments = async function(event, post) {
    var commentQuery = Comment
    .find({event: event._id, post: post._id});
    return commentQuery.exec();
};

var getCommentByID = async function(event, post, commentID) {
    var commentQuery = Comment.findOne({event: event._id, post: post._id, _id: commentID});
    return returnCommentOrError(await commentQuery.exec());
};

var getCommentByURL = async function(event, post, commentURL) {
    var commentQuery = Comment.findOne({event: event._id, post: post._id, url: commentURL});
    return returnCommentOrError(await commentQuery.exec());
};
//Comment vote

module.exports = {
    createComment: createComment,
    getComments: getComments,
    getCommentByID: getCommentByID,
    getCommentByURL: getCommentByURL
};