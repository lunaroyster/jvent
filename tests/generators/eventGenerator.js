var seedrandom  = require("seedrandom");

var RNG = function(seed) {
    if(!seed) seed = seedrandom()();
    return function(iteration) {
        if(!iteration) iteration = 0;
        return seedrandom(seed+iteration).int32(); // Use a linear congruential generator
    };
};

var Event = class Event {
    constructor(seed) {
        this.seededRNG = RNG(seed);
        var _event = {};
        _event.name = Event.convertToBase36String(this.seededRNG(0));
        _event.byline = Event.convertToBase36String(this.seededRNG(1));
        _event.visibility = Event.visibility(Math.abs(this.seededRNG(2) % 3));
        _event.ingress = Event.ingress(Math.abs(this.seededRNG(3) % 3));
        _event.comment = Event.comment(Math.abs(this.seededRNG(4) % 3));
        this._event = _event;
    }
    static convertToBase36String(number) {
        return (Math.abs(number)).toString(36);
    }
    static visibility(option) {
        return ["public", "unlisted", "private"][option];
    }
    static ingress(option) {
        return ["everyone", "link", "invite"][option];
    }
    static comment(option) {
        return ["anyone", "attendee", "nobody"][option];
    }
};

var EventGenerator = class EventGenerator {
    constructor() {
        this._seed = RNG()(); //Generates random seed upon init
        this._events = [];
    }
    event(iteration) {
        var i = 0;
        if(typeof iteration == "string") {
            i = iteration.charCodeAt();
        }
        else if(typeof iteration == "number") {
            i = iteration;
        }
        if(this._events[i]) return {event: this._events[i]};
        this._events[i] = new Event(i);
        return {event: this._events[i]};
    }

    get seed() {
        return this._seed;
    }
    set seed(value) {
        this._seed = value;
    }
};

module.exports = EventGenerator;