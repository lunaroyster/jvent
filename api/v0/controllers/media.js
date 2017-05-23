var Q = require('q');
var mediaCore = require('../../../core/media');

var common = require('./common');
var validateRequest = common.validateRequest;
var packError = common.packError;

module.exports.createEventMedia = function(req, res) {

};
module.exports.getEventMedia = function(req, res) {

};
module.exports.getEventMediaByURL = function (req, res) {

};

module.exports.appendMediaURL = function(req, res, next) {
    req.mediaURL = req.params.mediaURL;
    next();
};
