var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userListSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId]
    }
});

mongoose.model('UserList', userListSchema);