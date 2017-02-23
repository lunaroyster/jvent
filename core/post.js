var mongoose = require('mongoose');
// var User = mongoose.model('User');
var eventCore = require('./event');
var collectionCore = require('./collection');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

// module.exports.createPost = function(postSettings, event, superCollection) {
//     var newPost = new Post({
//         title: postSettings.title,
//         parentEvent: event._id,
//         superCollection: superCollection._id,
//         content: {
//             text: postSettings.contentText
//         },
//         timeOfCreation: Date.now()
//     });
//     return newPost.save();
// };

module.exports.createPost = function(user, post, event) {
    return collectionCore.getSuperCollectionByID(event.superCollection)
    .then(function(sc) {
        var newPost = new Post({
            title: post.title,
            parentEvent: event._id,
            superCollection: sc._id,
            content: {
                text: post.contentText
            },
            timeOfCreation: Date.now()
        });
        newPost.submitter.user = user._id;
        newPost.submitter.name = user.username;
        return newPost.save()
        .then(function(post) {
            sc.addPost(post);
            return sc.save()
            .then(function(sc) {
                return post;
            });
        });
        //Regular Collections?
    });
};


module.exports.getEventPosts = function(event) {
    //TODO: Queries
    // Can use either supercollection or direct. Change this implementation if required.
    var postQuery = Post.find({parentEvent: event._id});
    return postQuery.exec();
};

var returnPostOrError = function(post) {
    if(!post) throw Error("Can't find post");
    return post;
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
