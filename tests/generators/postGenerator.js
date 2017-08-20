var RNG = require('./RNG');
var prototypes = require('./prototypes');

var Post = class Post extends prototypes.objectPrototype {
    constructor(seed) {
        super();
        this.seededRNG = new RNG(seed);
        this.randomGenerator = this.seededRNG.generator();
        var _post = {};
        //Post properties
        this._post = _post;
    }
    random() {
        return this.randomGenerator.next().value;
    }
};

var PostGenerator = class PostGenerator {
    constructor() {
        this._seed = RNG.random(); //Generates random seed upon init
        this._posts = [];
    }
    post(iteration) {
        var i = 0;
        if(typeof iteration == "string") {
            i = iteration.charCodeAt();
        }
        else if(typeof iteration == "number") {
            i = iteration;
        }
        if(this._posts[i]) return {post: this._posts[i]};
        this._posts[i] = new Post(i*this._seed);
        return {post: this._posts[i]};
    }

    get seed() {
        return this._seed;
    }
    set seed(value) {
        this._seed = value;
    }
};

module.exports = PostGenerator;