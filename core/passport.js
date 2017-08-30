const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({usernameField: 'email'},
    (email, password, done)=> {
        User.findOne({ email: email }, (err, user)=> {
            if (err) { return done(err);}
            if (!user || !user.validPassword(password)) {return done(null, false, { message: 'Bad Auth.' });}
            return done(null, user);
        });
    }
));

//TODO: store secret more securely
var JWTopts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: "debug"
};

passport.use(new JwtStrategy(JWTopts, (jwt_payload, done)=> {
    User.findOne({_id: jwt_payload.sub}, (err, user)=> {
        if(err){return done(err, false);}
        if(user){return done(null, user);}
        else {return done(null, false);}
    });
}));

// TODO: Use the userCore library instead of directly querying?