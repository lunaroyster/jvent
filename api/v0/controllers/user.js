var Q = require('q');
var userCore = require('../../../core/user');

module.exports.authenticate = function(req, res) {
    userCore.generateToken(req.user)
    .then(function(token) {
        res.status(200);
        res.json({token: token});
    });
};

module.exports.signup = function(req, res) {
    Q.fcall(function() {
        var userObj = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        return userCore.createUser(userObj);
    })
    .then(function(status) {
        // Change status to user; figure out status by reading user object
        res.status(201);
        res.json(status);
    })
    .catch(function(error) {
        res.status(400);
        res.json(error);
    });
};

// Wait, what's this for?
module.exports.returnAuthenticatedUser = function(req, res) {
    res.json(req.user);
};