var Q = require('q');

module.exports.validateRequest = function(req, schema) {
    return Q.fcall(function() {
        req.check(schema);
        return req.getValidationResult()
        .then(function(result) {
            if(!result.isEmpty()) {
                result.throw();
            }
            return;
        });
    });
}

module.exports.packError = function(error) {
    var err;
    try {
        err = error.array();
    } catch (e) {
        if(e.name=="TypeError") {
            err = [{param:error.name, msg: error.message}];
        }
    }
    return err;
};

module.exports.createMediaTemplateFromRequest = function(req, media) {
    if(!media) return;
    var mediaObj = {
        user: req.user,
        event: req.event,
        link: media.link
    };
    return mediaObj;
};
