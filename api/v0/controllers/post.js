var postCore = require('../../../core/post');
var Q = require('q');
// var eventCore = require('../../../core/event');
var userListCore = require('../../../core/userList');
var collectionCore = require('../../../core/collection');
var mediaCore = require('../../../core/media');
var eventMembershipCore = require('../../../core/eventMembership');
var postRequestSchema = require('../requests').post;

var common = require('./common');
var validateRequest = common.validateRequest;
var packError = common.packError;
var createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;

// /post/
var checkCreatePostPrivilege = function(req) {
    return Q.fcall(function() {
        if(req.user.privileges.createPost) {
            return;
        }
        else {
            throw new Error("Bad privileges");
        }
    })
    .then(function() {
        return eventMembershipCore.isUserAttendee(req.user, req.event)
        .then(function() {
            return; //TODO: return only if user has post privileges within the event
        });
    })
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
module.exports.createPost = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, postRequestSchema.createPost);
    })
    .then(function() {
        return checkCreatePostPrivilege(req)
        .then(function() {
            return req.event;
        });
    }) // Checks create post privilege.
    .then(function() {
        var postTemplate = createPostTemplateFromRequest(req, req.body.post);
        var mediaTemplate = undefined;
        if(req.body.media) {
            mediaTemplate = createMediaTemplateFromRequest(req, req.body.media);
        }
        return postCore.createPost(postTemplate, mediaTemplate);
        // .then(function(post) {
        //     return collectionCore.addPostToCollectionByID(post, req.user.posts)
        //     .then(function(collection) {
        //         return post;
        //     });
        // }); //TODO: secondary collections
    })    //Create post and add to collections
    .spread(function(post, media) {
        console.log([post,media])
        var state = {
            status: "Created",
            post: {
                url: post.url
            }
        };
        if(media) {
            state.media = {
                url: media.url
            };
        }
        res.status(201).json(state);
        return;
    })     //Send post creation success
    .catch(function(error) {
        var err = packError(error);
        console.log(error.stack);
        res.status(400).json(err);
    });
};

module.exports.getPosts = function(req, res) {
    // get a promise
    // check req for querystring or parameters and format query
    var responseObject = {};
    return postCore.getEventPosts(req.event)
    .then(function(posts) {
        responseObject.posts = posts;
        res.status(200);
        res.json(responseObject);
    });
};

// /post/:postURL

module.exports.getPostByID = function(req, res) {
    // Check user privilege
    // Perhaps check querystring (for comment sorting maybe?)
    return postCore.getPostByID(req.event._id, req.params.postURL)
    .then(function(post) {
        res.status(200);
        res.json(post);
    });
};
module.exports.getPost = function(req, res) {
    var responseObject = {};
    responseObject.post = req.post;
    res.status(200).json(responseObject);
};

// module.exports.updatePost = function(req, res) {
//     res.json(req);
//     res.send();
// };
// module.exports.deletePost = function(req, res) {
//     res.json(req);
//     res.send();
// };

module.exports.appendPostURL = function(req, res, next) {
    req.postURL = req.params.postURL;
    next();
};
module.exports.appendPost = function(req, res, next) {
    postCore.getPostByURL(req.event, req.postURL)
    .then(function(post) {
        req.post = post;
        next();
    });
};

// /post/:postURL/vote

module.exports.vote = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, postRequestSchema.vote);
    })
    .then(function() {
        return postCore.vote(req.user, req.post, req.body.direction);
    })
    .then(function(response) {
        if(response.change) {
            res.status(200).json(response);
        }
        else {
            res.status(400).json(response);
        }
    })
    .catch(function(error) {
        var err = packError(error);
        res.status(400).json(err);
    });
};
