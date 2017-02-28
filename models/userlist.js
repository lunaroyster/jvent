var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userListSchema = new Schema({
    list: {
        type: [Schema.Types.ObjectId]
    },
    listType: String
});

mongoose.model('UserList', userListSchema);