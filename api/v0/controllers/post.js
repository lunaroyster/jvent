var postCore = require('../../../core/post');
var eventCore = require('../../../core/event');
var userListCore = require('../../../core/userList');
var collectionCore = require('../../../core/collection');
var postRequestSchema = require('../requests/post');

// /post/

module.exports.createPost = function(req, res) {
    req.check(postRequestSchema.createPost);
    req.getValidationResult()
    .then(function(result) {
        if(!result.isEmpty()) {
            result.throw();
        }
        return;
    })
    .then(function() {
        if(req.user.privileges.createPost) {
            return;
        }
        else {
            throw new Error("Bad privileges");
        }
    })
    .then(function() {
        return userListCore.isUserAttendee(req.user, req.event)
        .then(function() {
            return req.event; //TODO: return only if user has post privileges
        });
    })
    .then(function(event) {
        var postSettings = {
            title: req.body.post.title,
            contentText: req.body.post.content.text
        };
        return postCore.createPost(req.user, postSettings, event);
    })
    .then(function(post) {
        res.status(201).json(post);
    })
    .catch(function(error) {
        var err;
        try {
            err = error.array();
        } catch (e) {
            console.log(e);
            if(e.name=="TypeError") {
                err = [{param:error.name, msg: error.message}];
            }
        }
        console.log(err);
        res.status(400).json(err);
    });
};

module.exports.getPosts = function(req, res) {
    // get a promise
    // check req for querystring or parameters and format query
    return postCore.getPosts(req.event._id) //TODO: Amend post core to directly use event objects.
    .then(function(posts) {
        res.status(200);
        res.json(posts);
    });
};

// /post/:postID

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

module.exports.updatePost = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deletePost = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.appendPostID = function(req, res, next) {
    req.postID = req.params.postID;
    next();
};