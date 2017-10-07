const assert = require('chai').assert;

const eventCore = require('../../../core/event');
const eventSettingsRequestSchema = require('../requests').eventSettings;
const eventMembershipCore = require('../../../core/eventMembership');

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const asyncWrap = common.asyncWrap;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;

var getEventBackground = function(req, res) {
    //  TODO: Implement
};
var setEventBackground = async function(req, res) {
    try {
        // Validate request
        await validateRequest(req, eventSettingsRequestSchema.setEventBackground);
        // Check user privileges
        let eventMembership = await req.getEventMembership();
        assert(eventMembership.can("setEventBackground"), "User doesn't have sufficient privileges");
        // setEventBackground
        let mediaTemplate = createMediaTemplateFromRequest(req, req.body.media);
        let eventBackground = await eventCore.setEventBackground(req.event, mediaTemplate);
        var state = {
            status: "Created",
            media: eventBackground.url
        };
        res.status(201).json(state);
    }
    catch (error) {
        // console.log(error.stack);
        var err = packError(error);
        res.status(400).json(err);
    }
};

module.exports = {
    getEventBackground: asyncWrap(getEventBackground),
    setEventBackground: asyncWrap(setEventBackground)
};