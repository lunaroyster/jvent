// /event/
module.exports.createEvent = function(req, res) {
    res.json(req);
    res.send();
};

module.exports.getEvents = function(req, res) {
    res.json(req);
    res.send();
};

// /event/:eventID
module.exports.getEventByID = function(req, res) {
    res.json(req);
    res.send();
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