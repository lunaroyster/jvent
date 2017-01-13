module.exports.createPost = {
    'post.title': {
        notEmpty: true,
        isLength: {
            options: [{max:256}],
            errorMessage: 'The title can be at most 256 chars'
        }
    },
    'post.content.text': {
        optional: true,
        notEmpty: true,
        isLength: {
            options: [{max:16384}],
            errorMessage: 'The body can be at most 16384 chars'
        }
    }
};