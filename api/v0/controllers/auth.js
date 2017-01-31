var passport = require('passport');

module.exports.blockingjwtAuth = passport.authenticate('jwt', { session: false});
module.exports.localAuth = passport.authenticate('local', { session: false });

module.exports.nonblockingjwtAuth = function(req, res, next) {
    passport.authenticate('jwt', {session:false}, function(err, user, info) {
        if(user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};