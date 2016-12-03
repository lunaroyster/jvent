var postCore = require('../../../core/post')

// /post/
module.exports.createPost = function(req, res) {
    var postSettings = {
        title: req.body.title,
        contentText: req.body.content.text
    };
    postCore.createPost(postSettings, req.eventID, function(state) {
        res.status(201);
        res.json(state);
    });
};

module.exports.getPosts = function(req, res) {
    postCore.getPosts(req.eventID, function(err, posts) {
        if(!err){
           res.json(posts); 
        }
    });
};

// /post/:postID
module.exports.getPostByID = function(req, res) {
    postCore.getPostByID(req.eventID, req.params.postID, function(err, post) {
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