// /post/
module.exports.createPost = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.getPosts = function(req, res) {
    res.json(req);
    res.send();
};

// /post/:postID
module.exports.getPostByID = function(req, res) {
    res.json(req);
    res.send();
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