var postCore = require('../../../core/post');
var Q = require('q');
// var eventCore = require('../../../core/event');
var userListCore = require('../../../core/userList');
var collectionCore = require('../../../core/collection');
var mediaCore = require('../../../core/media');
var eventMembershipCore = require('../../../core/eventMembership');
var postRequestSchema = require('../requests/post');

var validateRequest = function(req, schema) {
    return Q.fcall(function() {
        req.check(schema);
        req.getValidationResult()
        .then(function(result) {
            if(!result.isEmpty()) {
                result.throw();
            }
            return;
        });
    });
}

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
var createPostTemplateFromRequest = function(req) {
    return {
        title: req.body.post.title,
        content: {
           text: req.body.post.content.text,
           link: req.body.post.content.link
        }
    };
};
module.exports.createPost = function(req, res) {
    return validateRequest(req, postRequestSchema.createPost)
    .then(function() {
        return checkCreatePostPrivilege(req)
        .then(function() {
            return req.event;
        });
    }) // Checks create post privilege.
    .then(function(event) {
        var media = {
            link: req.body.post.link        //TEMP
        };
        return media;
    })    //Create media
    .then(function(media) {
        return postCore.createPostWithMedia(req.user, createPostTemplateFromRequest(req), req.event, media);
        // .then(function(post) {
        //     return collectionCore.addPostToCollectionByID(post, req.user.posts)
        //     .then(function(collection) {
        //         return post;
        //     });
        // }); //TODO: secondary collections
    })    //Create post and add to collections
    .then(function(post) {
        var state = {
            status: "Created",
            post: {
                url: post.url
            }
        };
        res.status(201).json(state);
    })     //Send post creation success
    .catch(function(error) {
        var err;
        console.log(error.stack);
        try {
            err = error.array();
        } catch (e) {
            if(e.name=="TypeError") {
                err = [{param:error.name, msg: error.message}];
            }
        }
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
    return postCore.getPostByID(req.event._id, req.params.postID)
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

module.exports.appendPostID = function(req, res, next) {
    req.postID = req.params.postID;
    next();
};
module.exports.appendPost = function(req, res, next) {
    postCore.getPostByURL(req.event, req.params.postURL)
    .then(function(post) {
        req.post = post;
        next();
    });
};

// /post/:postURL/vote

module.exports.vote = function(req, res) {
    return validateRequest(req, postRequestSchema.vote)
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
    });
};
