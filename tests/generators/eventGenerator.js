var RNG = require('./RNG');
var prototypes = require('./prototypes');

var Event = class Event extends prototypes.objectPrototype {
    constructor(seed) {
        super();
        this.seededRNG = RNG(seed);
        var _event = {};
        _event.name = super.constructor.convertToBase36String(this.seededRNG(0));
        _event.byline = super.constructor.convertToBase36String(this.seededRNG(1));
        _event.visibility = Event.visibility(Math.abs(this.seededRNG(2) % 3));
        _event.ingress = Event.ingress(Math.abs(this.seededRNG(3) % 3));
        _event.comment = Event.comment(Math.abs(this.seededRNG(4) % 3));
        this._event = _event;
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
        this._events[i] = new Event(i*this._seed);
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