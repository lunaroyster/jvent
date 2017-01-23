var postCore = require('../../../core/post');
var postRequestSchema = require('../requests/post');

// /post/
module.exports.createPost = function(req, res) {
    req.check(postRequestSchema.createPost);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()) {
            res.status(400);
            res.json(result.array());
            return;
        }
        //TODO: Cannot read property 'text' of undefined
        //TODO: Get rid of callback based code.
        var postSettings = {
            title: req.body.post.title,
            contentText: req.body.post.content.text
        };
        postCore.createPost(postSettings, req.eventID, function(state) {
            res.status(201);
            res.json(state);
        });
    });
};

module.exports.getPosts = function(req, res) {
    postCore.getPosts(req.eventID, function(err, posts) {
        if(!err){
          res.json(posts); 
        }
    });
};

module.exports.getPosts = function(req, res) {
    // get a promise
    // check user privilege
    // check req for querystring or parameters and format query
    return postCore.getPosts(req.eventID)
    .then(function(posts) {
        res.status(200);
        res.json(posts);
    });
};

// /post/:postID
module.exports.getPostByID = function(req, res) {
    postCore.getPostByID(req.eventID, req.params.postID, function(err, post) {
        res.json(post);
    });
};

module.exports.getPostByID = function(req, res) {
    // Check user privilege
    // Perhaps check querystring (for comment sorting maybe?)
    return postCore.getPostByID(req.eventID, req.params.postID)
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