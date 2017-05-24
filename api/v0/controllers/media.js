var Q = require('q');
var mediaCore = require('../../../core/media');
var eventMembershipCore = require('../../../core/eventMembership');

var mediaRequestSchema = require('../requests').media;

var common = require('./common');
var validateRequest = common.validateRequest;
var packError = common.packError;
var createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;

var checkCreateMediaPrivilege = function(req) {
    return Q.fcall(function() {
        if(req.user.privileges.createMedia) {
            return;
        }
        else {
            throw new Error("Bad privileges");
        }
    })
    .then(function() {
        return eventMembershipCore.isUserAttendee(req.user, req.event)
        .then(function() {
            return; //TODO: return only if user has media privileges within the event
        });
    })
};
module.exports.createEventMedia = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, mediaRequestSchema.createMedia)
    })
    .then(function() {
        return checkCreateMediaPrivilege(req);
    })         //Check user privileges
    .then(function() {
        return mediaCore.createEventMedia(createMediaTemplateFromRequest(req));
    })         //Create media (using authenticated user)
    .then(function(media) {
        var state = {
            status: "Created",
            media: {
                url: media.url,
            }
        };
        res.status(201).json(state);
        return;
    })    //Send media creation success
    .catch(function(error) {
        var err = packError(error);
        res.status(400).json(err);
    });
};

module.exports.getEventMedia = function(req, res) {

};
module.exports.getEventMediaByURL = function (req, res) {

};

module.exports.appendMediaURL = function(req, res, next) {
    req.mediaURL = req.params.mediaURL;
    next();
};
