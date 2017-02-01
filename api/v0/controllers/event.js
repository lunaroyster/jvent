var eventCore = require('../../../core/event');
var eventRequestSchema = require('../requests/event');

// /event/

module.exports.createEvent = function(req, res) {
    req.check(eventRequestSchema.postEvent);
    req.getValidationResult()
    .then(function(result) {
        if(!result.isEmpty()) {
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
        var eventSettings = {
            name: req.body.event.name,
            byline: req.body.event.byline,
            description: req.body.event.description,
            visibility: req.body.event.visibility,
            ingress: req.body.event.ingress,
            user: req.user
        };
        return eventCore.createEvent(eventSettings)
        .then(function(event) {
            //Add event to User's collection
            return event;
        });
    })
    .then(function(event) {
        var state = {
            status: "Created",
            event: event._id
        };
        res.status(200).json(state);
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

module.exports.getEvent = function(req, res) {
    var responseObject = {};
    responseObject.event = req.event;
    res.status(200).json(responseObject);
};

module.exports.updateEvent = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.deleteEvent = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.appendEventIfVisible = function(req, res, next) {
    eventCore.getEventByID(req.params.eventID)
    .then(function(event) {
        if(event.visibility=="public") {
            req.event = event;
            next();
            return;
        }
        else if(event.visibility=="unlisted") {
            if(req.user) {
                req.event = event;
                next();
                return;
            }
            else {
                throw new Error("Bad Auth");
            }
        }
        else if(event.visibility=="private") {
            //Queries and stuff
        }
    })
    .catch(function(error) {
        next(error);
    });
      
};