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
    
});

mongoose.model('User', userSchema);