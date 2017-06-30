var Q = require('q');
var assert = require('chai').assert;

var eventCore = require('../../../core/event');
var eventSettingsRequestSchema = require('../requests').eventSettings;
var eventMembershipCore = require('../../../core/eventMembership');

var common = require('./common');
var validateRequest = common.validateRequest;
var packError = common.packError;
var createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;

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
