function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

var data = require("./data");

