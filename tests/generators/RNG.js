var seedrandom  = require("seedrandom");

var RNG = function(seed) {
    if(!seed) seed = seedrandom()();
    return function(iteration) {
        if(!iteration) iteration = 0;
        return seedrandom(seed+iteration).int32(); // Use a linear congruential generator
    };
};

module.exports = RNG;