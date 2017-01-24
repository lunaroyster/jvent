var eventCore = require('../../../core/event');
var eventRequestSchema = require('../requests/event');

// /event/
module.exports.createEvent = function(req, res) {
    req.check(eventRequestSchema.postEvent);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()) {
            res.status(400);
            res.json(result.array());
            return;
        }
        var eventSettings = {
            name: req.body.event.name,
            byline: req.body.event.byline,
            description: req.body.event.description,
            visibility: req.body.event.visibility,
            ingress: req.body.event.ingress,
            user: req.user
        };
        eventCore.createEvent(eventSettings, function(state) {
            res.status(201);
            res.json(state);
        });
    });
};

module.exports.createEvent = function(req, res) {
    req.check(eventRequestSchema.postEvent);
    req.getValidationResult()
    .then(function(result) {
        if(!result.isEmpty()) {
            // throw new Error({
            //     msg: "Request Validation Failed",
            //     errors: result.array()
            // });
            result.throw();
        }
        return;
    })
    .then(function() {
        if(req.user.privileges.createEvent) {
            return;
        }
        else {
            throw new Error("Bad privileges");
        }
    })
    .then(function() {
        return eventCore.createEvent()
        .then(function(event) {
            //Add event to User's collection
        });
    })
    .catch(function(error) {
        var err;
        try {
            err = error.array();
        } catch (e) {
            console.log(e);
            if(e.name=="TypeError") {
                err = [{param:error.name, msg: error.message}];
            }
        }
        console.log(err);
        res.status(400).json(err);
    });
};

module.exports.getEvents = function(req, res) {
    var responseObject = {};
    eventCore.getEvents(function(err, events) {
        if (!err) {
            responseObject.events = events;
            res.status(200);
            res.json(responseObject);
        }
        else {
            responseObject.error = err;
            res.status(400);
            res.json(responseObject);
        }
    });
};

module.exports.getEvents = function(req, res) {
    var responseObject = {};
    eventCore.getEvents()
    .then(function(events) {
        responseObject.events = events;
        res.status(200);
        res.json(responseObject);
    }, function(error) {
        responseObject.error = error;
        res.status(400);
        res.json(responseObject);
    });
};

// /event/:eventID
module.exports.getEventByID = function(req, res) {
    var responseObject = {};
    eventCore.getEventByID(req.params.eventID, function(err, event) {
        if(!err) {
            responseObject.event = event;
            res.status(200);
            res.json(responseObject);  
        }
        else {
            responseObject.error = err;
            res.status(400);
            res.json(responseObject);
        }
    });
};

module.exports.getEventByID = function(req, res) {
    var responseObject = {};
    eventCore.getEventByID(req.params.eventID)
    .then(function(event) {
        responseObject.event = event;
        res.status(200);
        res.json(responseObject);  
    }, function(error) {
        responseObject.error = error;
        res.status(400);
        res.json(responseObject);
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

// TODO: Remove callback functions