var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user || !user.validPassword(password)) {return done(null, false, { message: 'Bad Auth.' })}
      return done(null, user);
    });
  }
));

//TODO: store secret more securely
var JWTopts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: "debug"
};

passport.use(new JwtStrategy(JWTopts, function(jwt_payload, done) {
  User.findOne({_id: jwt_payload.sub}, function(err, user) {
    if(err){return done(err, false)}
    if(user){return done(null, user)}
    else {return done(null, false)}
  });
}));

// TODO: Use the userCore library instead of directly querying?