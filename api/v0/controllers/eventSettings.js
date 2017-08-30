const Q = require('q');
const assert = require('chai').assert;

const eventCore = require('../../../core/event');
const eventSettingsRequestSchema = require('../requests').eventSettings;
const eventMembershipCore = require('../../../core/eventMembership');

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;

module.exports.getEventBackground = function(req, res) {
    //  TODO: Implement
};
module.exports.setEventBackground = function(req, res) {
    Q.fcall(function() {
        return validateRequest(req, eventSettingsRequestSchema.setEventBackground);
    })
    .then(function() {
        // Check user privileges
        return req.getEventMembership()
        .then(function(eventMembership) {
            assert(eventMembership.hasRole("organizer"), "User is not an organizer"); //TODO: Change role test to privilege test
            return;
        })
    })
    .then(function() {
        // setEventBackground
        var mediaTemplate = createMediaTemplateFromRequest(req, req.body.media);
        return eventCore.setEventBackground(req.event, mediaTemplate);
    })
    .then(function(eventBackground) {
        var state = {
            status: "Created"
        };
        res.status(201).json(state);
        return;
        // Send success response (with either media link or entire event)
    })
    .catch(function(error) {
        // console.log(error.stack);
        var err = packError(error);
        res.status(400).json(err);
    });
};
