module.exports.users = {
    test: {
        username: "test",
        email: "test@unpaidinterns.example.org",
        password: "t35tl012D"
    },
    eventtester: {
        username: "eventtester",
        email: "eventtester@unpaidinterns.example.org",
        password: "t35tl012D"
    },
    shortUsername: {
        username: "a",
        email: "shortUsername@unpaidinterns.example.org",
        password: "t35tl012D"
    },
    badEmail: {
        username: "badEmail",
        email: "shortUsername@unpaidinterns",
        password: "t35tl012D"
    },
    easyPassword: {
        username: "badPassword",
        email: "shortUsername@unpaidinterns.example.org",
        password: "123"
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
    jeffsAlt: {
        username: "jeffsAlt",
        email: "jeff@unpaidinterns.example.org",
        password: "7KKkrBEc"
    },
    lucida: {
        username: "lucida",
        email: "lucida@unpaidinterns.example.org",
        password: "4WJY3RgX"
    },
    lucidasAlt: {
        username: "lucida",
        email: "lucida2@unpaidinterns.example.org",
        password: "4WJY3RgX"
    },
    alice: {
        username: "alice",
        email: "alice@unpaidinterns.example.org",
        password: "FNDMwB6x"
    },
    bob: {
        username: "bob",
        email: "bob@unpaidinterns.example.org",
        password: "WyZtrpjF"
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
        visibility: "public",
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
        ingress: "invite"
    },
    prom: {
        name: "Generic HS Prom Night",
        byline: "Dance! Music! Romance!",
        description: "Awkward Dancing! Lame Music! STDs!",
        visibility: "private",
        ingress: "invite"
    },
    bookSigning: {
        name: "Book signing!",
        byline: "Meet the author",
        description: "",
        visibility: "unlisted",
        ingress: "everyone"
    },
    privateEveryone: {
        name: "PrivateEveryone",
        byline: "PrivateEveryone",
        description: "PrivateEveryone",
        visibility: "private",
        ingress: "everyone"
    },
    privateLink: {
        name: "privateLink",
        byline: "privateLink",
        description: "privateLink",
        visibility: "private",
        ingress: "link"
    },
    generic: {
        name: "Generic Event",
        byline: "Nothing interesting",
        description: "No BS",
        visibility: "public",
        ingress: "everyone"
    },
    incomplete: {
        noName: {
            byline: "Nothing interesting",
            description: "No BS",
            visibility: "public",
            ingress: "everyone"
        },
        // noByline: {
        //     name: "Generic Event",
        //     description: "No BS",
        //     visibility: "public",
        //     ingress: "everyone"
        // },
        noVisibility: {
            name: "Generic Event",
            byline: "Nothing interesting",
            description: "No BS",
            ingress: "everyone"
        },
        noIngress: {
            name: "Generic Event",
            byline: "Nothing interesting",
            description: "No BS",
            visibility: "public"
        }
    }
};

module.exports.events = events;

module.exports.eventTypes = {	
    Public: {		
        Everyone: events.festival,		
        Link: events.protest,		
        Invite: events.concert		
    },	
    Unlisted: {		
        Everyone: events.bookSigning,		
        Link: events.blockParty,		
        Invite: events.schoolHackathon	
    },
    Private: {		
        Everyone: events.privateEveryone,		
        Link: events.privateLink,		
        Invite: events.prom		
    }
};

// Reduces the number of dependent links that would break if app.js had to be moved.
module.exports.app = require("../app.js");