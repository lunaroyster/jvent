module.exports.users = {
    test: {
        username: "test",
        email: "test@unpaidinterns.example.org",
        password: "t35tl012D"
    },
    noUsername: {
        email: "test@unpaidinterns.example.org",
        password: "t35tl012D"
    },
    noEmail: {
        username: "test",
        password: "t35tl012D"
    },
    noPassword: {
        username: "test",
        email: "test@unpaidinterns.example.org"
    },
    jeff: {
        username: "jeff",
        email: "jeff@unpaidinterns.example.org",
        password: "7KKkrBEc"
    },
    lucida: {
        username: "lucida",
        email: "lucida@unpaidinterns.example.org",
        password: "4WJY3RgX"
    }
};

// Reduces the number of dependent links that would break if app.js had to be moved.
module.exports.app = require("../app.js");