module.exports.createMedia = {
    'media.link': {
        optional: false,
        notEmpty: true,
        isLink: {
            errorMessage: "Not a valid link."
        }
    }
};
