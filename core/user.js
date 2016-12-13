var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var User = mongoose.model('User');

module.exports.getUserByID = function(userID, callback) {};
module.exports.getUserByEmail = function(email, callback) {};
module.exports.getUserByUsername = function(username, callback) {};

module.exports.getToken = function(user, callback) {};