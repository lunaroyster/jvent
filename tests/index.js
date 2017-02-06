// function importTest(name, path) {
//     describe(name, function () {
//         require(path);
//     });
// }

var data = require("./data");

describe("tests", function () {
    beforeEach(function () {
        
    });
    // importTest("user", './user/index');
    require('./user/index');
    after(function () {
        
    });
});