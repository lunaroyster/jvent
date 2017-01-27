var userCore = require('../../../core/user');

// module.exports.authenticate = function(req, res) {
//     userCore.generateToken(req.user, function(token) {
//         res.status(200);
//         res.json({token: token});
//     });
// };

module.exports.authenticate = function(req, res) {
    userCore.generateToken(req.user)
    .then(function(token) {
        res.status(200);
        res.json({token: token});
    });
};

// module.exports.signup = function(req, res) {
//     var userObj = {
//         email: req.body.email,
//         username: req.body.username,
//         password: req.body.password
//     };
//     userCore.createUser(userObj, function(err, status) {
//         if(!err) {
//             res.status(201);
//             res.json(status);
//         }
//         else {
//             res.status(400);
//             res.json(status);
//         }
//     });
// };

module.exports.signup = function(req, res) {
    var userObj = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };
    userCore.createUser(userObj)
    .then(function(status) {
        // Change status to user; figure out status by reading user object
        res.status(201);
        res.json(status);
    });
};

// Wait, what's this for?
module.exports.returnAuthenticatedUser = function(req, res) {
    res.json(req.user);
};