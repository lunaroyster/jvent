var RNG = require('./RNG');
var prototypes = require('./prototypes');

var User = class User extends prototypes.objectPrototype {
    constructor(seed) {
        super();
        this.seededRNG = new RNG(seed);
        this.randomGenerator = this.seededRNG.generator();
        var _user = [];
        this._user = _user;
    }
};

var UserGenerator = class UserGenerator {
    constructor() {
        this._seed = RNG.random(); //Generates random seed upon init
        this._users = [];
    }
    user(iteration) {
        var i = 0;
        if(typeof iteration == "string") {
            i = iteration.charCodeAt();
        }
        else if(typeof iteration == "number") {
            i = iteration;
        }
        if(this._users[i]) return {user: this._users[i]};
        this._users[i] = new User(i*this._seed);
        return {user: this._users[i]};
    }

    get seed() {
        return this._seed;
    }
    set seed(value) {
        this._seed = value;
    }
};

module.exports = UserGenerator;