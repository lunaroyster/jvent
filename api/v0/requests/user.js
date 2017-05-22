module.exports.signup = {
    'user.email': {
        optional: false,
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email'
        }
    },
    'user.username': {
        optional: false,
        notEmpty: true,
        isLength: {
            options: [{ min: 4, max: 16 }],
            errorMessage: 'Must be between 4 and 16 characters'
        }
    },
    'user.password': {
        optional: false,
        notEmpty: true,
    }
};
