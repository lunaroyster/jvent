var mongoose = require('mongoose');
var data = require("./data");
var app = data.app;

describe("tests", function () {
    before(function() {
        mongoose.connection.db.dropDatabase(function(err, result) {
            if(err) throw err;
        });
    });
    beforeEach(function () {
        
    });
    require('./user/index');
    require('./event/index');
    after(function () {
        
    });
});