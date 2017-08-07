module.exports.getImageUploadToken = {
    'file-name': {
        in: 'query',
        notEmpty: true,
        errorMessage: "Bad file name"
    },
    'file-type': {
        in: 'query',
        notEmpty: true,
        errorMessage: "Bad file type"
    }
};