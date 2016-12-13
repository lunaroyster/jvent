var userCore = require('../../../core/user');

module.exports.authenticate = function(req, res) {
    userCore.getToken(req.user, function(token) {
        res.status(200);
        res.json(token);
    });
};

module.exports.signup = function(req, res) {
    var userObj = {
        
    }
};
