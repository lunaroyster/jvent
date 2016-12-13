var userCore = require('../../../core/user');

module.exports.authenticate = function(req, res) {
    userCore.generateToken(req.user, function(token) {
        res.status(200);
        res.json({token: token});
    });
};

module.exports.signup = function(req, res) {
    var userObj = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };
    userCore.createUser(userObj, function(status) {
        res.json(status);
    });
};

module.exports.returnAuthenticatedUser = function(req, res) {
    res.json(req.user);
};