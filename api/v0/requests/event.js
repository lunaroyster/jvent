module.exports.postEvent = {
    //'event.name': {
    'event': {
        'name': {
            notEmpty: true
        },
        'byline': {
            notEmpty: true
        },
        'visibility': {
            notEmpty: true
        },
        'ingress': {
            notEmpty: true
        }
    }
};

module.exports.patchEvent = {};
module.exports.deleteEvent = {};