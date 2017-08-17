var seedrandom  = require("seedrandom");

var RNG = class RNG {
    constructor(seed) {
        if(!seed) seed = seedrandom()();
        this.seed = seed;
    }
    * generator() {
        var iteration = 0;
        while(true) {
            yield seedrandom(this.seed+iteration).int32(); // Use a linear congruential generator
            iteration++;
        }
    }
    static random() {
        return seedrandom().int32();
    }
};

module.exports = RNG;