module.exports.postEvent = {
    //'event.name': {
    'event.name': {
        notEmpty: true,
        isLength: {
            options: [{ min: 4, max: 64 }],
            errorMessage: 'Must be between 4 and 64 chars long'
        },
    },
    'event.byline': {
        notEmpty: true
    },
    'event.visibility': {
        notEmpty: true
    },
    'event.ingress': {
        notEmpty: true
    }
};

module.exports.patchEvent = {};
module.exports.deleteEvent = {};