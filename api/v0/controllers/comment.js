// /comment/
module.exports.createComment = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.getComments = function(req, res) {
    res.json(req);
    res.send();
};

// /comment/:commentID
module.exports.getCommentByID = function(req, res) {
    // res.json(req);
    res.send(JSON.stringify(res));
};

module.exports.updateCommentByID = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deleteCommentByID = function(req, res) {
    res.json(req);
    res.send();
};