const mediaCore = require('../../../core/media');
const eventMembershipCore = require('../../../core/eventMembership');
const assert = require('chai').assert;

const mediaRequestSchema = require('../requests').media;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const asyncWrap = common.asyncWrap;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;
const EventMembership = eventMembershipCore.EventMembership;

var checkCreateMediaPrivilege = async function(req) {
    if(!req.user.privileges.createMedia) throw new Error("Bad privileges");
    let eventMembership = await req.getEventMembership();
    assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
};
var createEventMedia = async function(req, res) {
    try {
        await validateRequest(req, mediaRequestSchema.createMedia);
        await checkCreateMediaPrivilege(req);
        let media = await mediaCore.createEventMedia(createMediaTemplateFromRequest(req));
        var state = {
            status: "Created",
            media: {url: media.url}
        };
        res.status(201).json(state);
    }
    catch (error) {
        var err = packError(error);
        res.status(400).json(err);
    }
};

var getEventMedia = function(req, res) {

};
var getEventMediaByURL = function (req, res) {

};

var appendMediaURL = function(req, res, next) {
    req.mediaURL = req.params.mediaURL;
    next();
};

module.exports = {
    createEventMedia: createEventMedia,
    getEventMedia: getEventMedia,
    getEventMediaByURL: getEventMediaByURL,
    appendMediaURL: appendMediaURL
};