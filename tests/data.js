module.exports.user = {
    username: "test",
    email: "test@unpaidinterns.example.org",
    password: "t35tl012D"
};

module.exports.users = {
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
    }
}

// Reduces the number of dependent links that would break if app.js had to be moved.
module.exports.app = require("../app.js");