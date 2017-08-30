module.exports.signup = {
    'user.email': {
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email'
        }
    },
    'user.username': {
        notEmpty: true,
        isLength: {
            options: [{ min: 4, max: 16 }],
            errorMessage: 'Must be between 4 and 16 characters'
        }
    },
    'user.password': {
        notEmpty: true,
        isLength: {
            options: [{ min: 6, max: 128}],
            errorMessage: 'Must be between 6 and 128 characters'
        }
    }
};
module.exports.changePassword = {
    'newpassword': {
        in: 'headers',
        notEmpty: true,
        exists: {
            errorMessage: 'No newpassword field'
        },
        isLength: {
            options: [{ min: 6, max: 128}],
            errorMessage: 'Must be between 6 and 128 characters'
        }
    },
    'oldpassword': {
        in: 'headers',
        notEmpty: true,
        exists: {
            errorMessage: 'No newpassword field'
        },
    }
};
 