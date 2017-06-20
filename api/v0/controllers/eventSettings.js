var Q = require('q');
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
        return eventMembershipCore.isUserModerator(req.user, req.event)
        .then(function() {
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
