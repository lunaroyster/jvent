var postCore = require('../../../core/post');
var eventCore = require('../../../core/event');
var collectionCore = require('../../../core/collection');
var postRequestSchema = require('../requests/post');

// /post/
// module.exports.createPost = function(req, res) {
//     req.check(postRequestSchema.createPost);
//     req.getValidationResult()
//     .then(function(result) {
//         if(!result.isEmpty()) {
//             res.status(400);
//             res.json(result.array());
//             return;
//         }
//         //TODO: Cannot read property 'text' of undefined
//         //TODO: Get rid of callback based code.
//         var postSettings = {
//             title: req.body.post.title,
//             contentText: req.body.post.content.text
//         };
//         postCore.createPost(postSettings, req.eventID, function(state) {
//             res.status(201);
//             res.json(state);
//         });
//     });
// };

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
        return eventCore.getEventIfAttendee(req.eventID, req.user);
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

// module.exports.getPosts = function(req, res) {
//     postCore.getPosts(req.eventID, function(err, posts) {
//         if(!err){
//           res.json(posts); 
//         }
//     });
// };

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
// module.exports.getPostByID = function(req, res) {
//     postCore.getPostByID(req.eventID, req.params.postID, function(err, post) {
//         res.json(post);
//     });
// };

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