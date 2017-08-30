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
    return Q.fcall(()=> {
        if(!req.user.privileges.createMedia) throw new Error("Bad privileges");
        return;
    })
    .then(()=> {
        return req.getEventMembership()
        .then((eventMembership)=> {
            assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
            return;
        })
    })
};
module.exports.createEventMedia = function(req, res) {
    Q.fcall(()=> {
        return validateRequest(req, mediaRequestSchema.createMedia)
    })
    .then(()=> {
        return checkCreateMediaPrivilege(req);
    })         //Check user privileges
    .then(()=> {
        return mediaCore.createEventMedia(createMediaTemplateFromRequest(req));
    })         //Create media (using authenticated user)
    .then((media)=> {
        var state = {
            status: "Created",
            media: {
                url: media.url,
            }
        };
        res.status(201).json(state);
        return;
    })    //Send media creation success
    .catch((error)=> {
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
