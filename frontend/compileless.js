var fs   = require('fs');
var path = require('path');
var less = require('less');

var render = function() {
    var src = "./less/style.less";
    less.render(fs.readFileSync(src).toString(), function(e, output) {
        fs.writeFile('./compiledless/test.css', output.css, {flag:'wx'}, function(error, output) {
            
        });
    });
};
render();