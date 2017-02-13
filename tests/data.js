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

var events = {
    festival: {
        name: "Christmas",
        byline: "Christmas 2017",
        description: "God bless consumerism!",
        visibility: "public",
        ingress: "everyone"
    },
    protest: {
        name: "#WantChange protests",
        byline: "Change! Slogans! Posters!",
        description: "And riots!",
        visibility: "public",
        ingress: "link"
    },
    fanConvention: {
        name: "GeneriCON",
        byline: "New Stuff! Cosplay! Food!",
        description: "Awkward panels",
        visibility: "public",
        ingress: "link"
    },
    concert: {
        name: "Heavy stuff",
        byline: "Headbanging! Drinking!",
        description: "Whiplash! Hearing loss!",
        visibility: "Public",
        ingress: "invite"
    },
    blockParty: {
        name: "PARDY mah house",
        byline: "i got stuffs",
        description: "bleh",
        visibility: "unlisted",
        ingress: "link"
    },
    schoolHackathon: {
        name: "Hack 2017",
        byline: "Code! Geeks! Pizza! Prizes!",
        description: "Unfinished projects! Awkward presentations!",
        visibility: "unlisted",
        ingress: "invited"
    },
    prom: {
        name: "Generic HS Prom Night",
        byline: "Dance! Music! Romance!",
        description: "Awkward Dancing! Lame Music! STDs!",
        visibility: "private",
        ingress: "invite"
    },
    bookSigning: {},
    generic: {
        name: "Generic Event",
        byline: "Nothing interesting",
        description: "No BS",
        visibility: "public",
        ingress: "everyone"
    }
};

module.exports.events = events;

module.exports.eventTypes = {	
    // Public: {		
    //     Everyone: events.festival,		
    //     Link: //,		
    //     Invite: //		
    // }		
    // Unlisted: {		
    //     Everyone: events.festival,		
    //     Link: //,		
    //     Invite: //		
    // }		
    // Private: {		
    //     Everyone: events.festival,		
    //     Link: //,		
    //     Invite: //		
    // }
};

// Reduces the number of dependent links that would break if app.js had to be moved.
module.exports.app = require("../app.js");