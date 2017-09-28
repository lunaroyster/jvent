const passport = require('passport');

module.exports.blockingjwtAuth = passport.authenticate('jwt', { session: false});
module.exports.localAuth = passport.authenticate('local', { session: false });

var nonblockingjwtAuth = function(req, res, next) {
    passport.authenticate('jwt', {session:false}, (err, user, info)=> {
        if(err) { next(err); }
        if(user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};

var AuthOnly = function(req, res, next) {
    if(req.user) {
        next();
    }
    else {
        var err = Error("Bad Auth");
        err.status = 401;
        next(err);
    }
};

module.exports = {
    nonblockingjwtAuth: nonblockingjwtAuth,
    AuthOnly: AuthOnly
};