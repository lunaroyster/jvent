var eventCore = require('../../../core/event');

// /event/
module.exports.createEvent = function(req, res) {
    var eventSettings = {
        name: req.body.eventName,
        byline: req.body.byline,
        description: req.body.desc,
        privacy: req.body.privacy
    };
    eventCore.createEvent(eventSettings, function(state) {
        res.status(201);
        res.json(state);
    });
};

module.exports.getEvents = function(req, res) {
    eventCore.getEvents(function(err, events) {
        if (!err) {
            res.status(200);
            res.json(events);
        }
    });
};

// /event/:eventID
module.exports.getEventByID = function(req, res) {
    // TODO: Handle Error
    eventCore.getEventByID(req.params.eventID, function(err, event) {
        res.json(event);    
    });
};

module.exports.updateEventByID = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deleteEventByID = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.appendEventID = function(req, res, next) {
    req.eventID = req.params.eventID;
    next();
};