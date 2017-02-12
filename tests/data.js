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

module.exports.events = {
    festival: {
        name: "Christmas",
        byline: "Christmas 2017",
        description: "God bless consumerism!",
    },
    protest: {
        name: "#WantChange protests",
        byline: "Change! Slogans! Posters!",
        description: "And riots!"
    },
    blockParty: {
        name: "PARDY mah house",
        byline: "i got stuffs",
        description: "bleh"
    },
    publicConvention: {
        name: "GeneriCON",
        byline: "New Stuff! Cosplay! Food!",
        description: "Awkward panels"
    },
    schoolHackathon: {
        name: "Hack 2017",
        byline: "Code! Geeks! Pizza! Prizes!",
        description: "Unfinished projects! Awkward presentations!"
    },
    prom: {
        name: "Generic HS Prom Night",
        byline: "Dance! Music! Romance!",
        description: "Awkward Dancing! Lame Music! STDs!"
    },
    bookSigning: {},
    generic: {
        name: "Generic Event",
        byline: "Nothing interesting",
        description: "No BS"
    }
};

// Reduces the number of dependent links that would break if app.js had to be moved.
module.exports.app = require("../app.js");