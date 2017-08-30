const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userListSchema = new Schema({
    list: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    listType: String
});

userListSchema.methods.userCount = function() {
    return this.list.length;
};

mongoose.model('UserList', userListSchema);