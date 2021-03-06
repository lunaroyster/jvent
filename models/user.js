const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    time: {
        passwordChange: {
            type: Date
        },
        creation: {
            type: Date
        }, //TODO: implement in code
        update: {
            type: Date
        }
    },
    privileges: {
        createEvent: {
            type: Boolean,
            default: true
        },
        createPost: {
            type: Boolean,
            default: true
        },
        createMedia: {
            type: Boolean,
            default: true
        },
        uploadImage: {
            type: Boolean,
            default: true
        }
    }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    this.time.passwordChange = Date.now();
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
        this.time.passwordChange = Date.now();
    }
    next();
});

userSchema.plugin(uniqueValidator);

mongoose.model('User', userSchema);
