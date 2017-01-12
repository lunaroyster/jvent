module.exports.postEvent = {
    //'event.name': {
    'event.name': {
        notEmpty: true,
        isLength: {
            options: [{ min: 4, max: 64 }],
            errorMessage: 'Must be between 4 and 64 characters'
        }
    },
    'event.byline': {
        optional: true,
        notEmpty: true,
        isLength: {
            options: [{max:128}],
            errorMessage: 'Must be fewer than 128 characters'
        }
    },
    'event.description': {
        optional: true,
        isLength: {
            options: [{max:1024}],
            errorMessage: 'Must be fewer than 1024 characters'
        }
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