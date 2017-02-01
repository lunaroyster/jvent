var postCore = require('../../../core/post');
var eventCore = require('../../../core/event');
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
        return req.event; //TODO: return only if user has post privileges
    })
    .then(function(event) {
        var connections = {};
        connections.event = event;
        return collectionCore.getSuperCollectionByID(event.superCollection)
        .then(function(sc) {
            connections.superCollection = sc;
            return connections;
        });
        // Add Regular Collections
    })
    .then(function(connections) {
        var postSettings = {
            title: req.body.post.title,
            contentText: req.body.post.content.text
        };
        postCore.createPost(postSettings, connections.event, connections.superCollection)
        .then(function(post) {
            return collectionCore.addPostToSuperCollection(post, connections.superCollection)
            .then(function() {
                return collectionCore.addPostToCollections(post, connections.collections);
            })
            .then(function() {
                return post;
            });
        });
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

module.exports.updatePostByID = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deletePostByID = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.appendPostID = function(req, res, next) {
    req.postID = req.params.postID;
    next();
};