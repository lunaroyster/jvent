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
