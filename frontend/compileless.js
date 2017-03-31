var fs   = require('fs');
var path = require('path');
var less = require('less');
var Q = require('q');

var render = function() {
    var lessFolder = "./less/";
    var outFolder = "./public/less/";
    Q.fcall(function() {
        return fs.readdirSync(lessFolder);
    })
    .then(function(lessFiles) {
        var filePromises = [];
        for (var lessFile in lessFiles) {
            var filePromise = less.render(fs.readFileSync(lessFolder + lessFile).toString())
            .then(function(output) {
                fs.writeFile(outFolder+lessFile, output.css, {flag:'wx'}, function(error, output) {
                    return;
                });
            });
            filePromises.push(filePromise);
        }
        return Q.all(filePromises);
    });
};
render();