var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    username: String,
    hash: String,
    salt: String,
    password: String //Switch to hash/salt
});
//TODO: Encrypt
userSchema.methods.setPassword = function(password, callback) {
    this.password = password;
    this.save(callback);
};

userSchema.methods.validPassword = function(password) {
    if(password==this.password) {
        return(true);
    }
    else {
        return(false);
    }
};

mongoose.model('User', userSchema);