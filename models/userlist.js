var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userListSchema = new Schema({
    list: {
        type: [Schema.Types.ObjectId]
    },
    listType: String
});

userListSchema.methods.userCount = function() {
    return this.list.length;
};

mongoose.model('UserList', userListSchema);