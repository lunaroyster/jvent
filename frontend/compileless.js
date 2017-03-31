var fs   = require('fs');
var path = require('path');
var less = require('less');
var Q = require('q');

function toCSS(lessFileName) {
    return lessFileName.replace(".less", ".css");
}

var render = function() {
    var lessFolder = "./less/";
    var outFolder = "./public/less/";
    Q.fcall(function() {
        return fs.readdirSync(lessFolder);
    })
    .then(function(lessFiles) {
        var filePromises = [];
        for (var lF in lessFiles) {
            var lessFile = lessFiles[lF];
            var filePromise = less.render(fs.readFileSync(lessFolder + lessFile).toString())
            .then(function(output) {
                var deferred = Q.defer();
                fs.writeFile(outFolder+toCSS(lessFile), output.css, {flag:'w'}, function(error, output) {
                    deferred.resolve();
                    return;
                });
                return deferred.promise;
            });
            filePromises.push(filePromise);
        }
        return Q.all(filePromises);
    })
    .then(function() {
        console.log("Compiled LESS files");
    });
};
render();