var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    username: String,
    hash: String,
    salt: String
});
//TODO: Encrypt
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

mongoose.model('User', userSchema);