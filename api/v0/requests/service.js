module.exports.getImageUploadToken = {
    //TODO: Either one is acceptable.
    'fileName': {
        in: 'query',
        // notEmpty: true,
        errorMessage: "Bad file name"
    },
    'fileType': {
        in: 'query',
        // notEmpty: true,
        errorMessage: "Bad file type"
    }
};