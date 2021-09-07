const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserCtrl = require('../services/user');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log(process.env.JWT_SECRET)
    opts.secretOrKey = process.env.JWT_SECRET;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        UserCtrl.getUserById(jwt_payload.data._id, (err, user) => {
            if (err) return done(err, false);
            if (user) { return done(null, user); } 
                else { return done(null, false); }
        });
    }))
}