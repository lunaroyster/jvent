const Q = require('q');
const mediaCore = require('../../../core/media');
const eventMembershipCore = require('../../../core/eventMembership');
const assert = require('chai').assert;

const mediaRequestSchema = require('../requests').media;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;
const EventMembership = eventMembershipCore.EventMembership;

var checkCreateMediaPrivilege = function(req) {
    return Q.fcall(function() {
        if(!req.user.privileges.createMedia) throw new Error("Bad privileges");
        return;
    })
    .then(function() {
        return req.getEventMembership()
        .then(function(eventMembership) {
            assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
            return;
        })
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
