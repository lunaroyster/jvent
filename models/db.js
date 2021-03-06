module.exports = function(db) {
    const mongoose = require('mongoose');
    const Q = require('q');
    var gracefulShutdown;
    var dbURI = 'mongodb://localhost/' + db;
    
    var deferred = Q.defer();
    mongoose.connect(dbURI, {useMongoClient: true});
    
    // CONNECTION EVENTS
    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected to ' + dbURI);
        return deferred.resolve();
    });
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose connection error: ' + err);
        return deferred.reject(err);
    });
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected');
    });
    
    mongoose.Promise = require('q').Promise;
    mongoose.set("debug", config.debugMode.mongoose);
    
    // CAPTURE APP TERMINATION / RESTART EVENTS
    // To be called when process is restarted or terminated
    gracefulShutdown = function(msg, callback) {
        mongoose.connection.close(function() {
            console.log('Mongoose disconnected through ' + msg);
            callback();
        });
    };
    // For nodemon restarts
    process.once('SIGUSR2', function() {
        gracefulShutdown('nodemon restart', function() {
            process.kill(process.pid, 'SIGUSR2');
        });
    });
    // For app termination
    process.on('SIGINT', function() {
        gracefulShutdown('app termination', function() {
            process.exit(0);
        });
    });
    // For Heroku app termination
    process.on('SIGTERM', function() {
        gracefulShutdown('Heroku app termination', function() {
            process.exit(0);
        });
    });
    
    return deferred.promise;
};