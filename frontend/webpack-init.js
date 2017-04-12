var webpack = require("webpack");
var config = require("./webpack.config");
// console.log(config);
webpack(config, function(err, stats) {
    console.log(err);
    console.log(stats);
});