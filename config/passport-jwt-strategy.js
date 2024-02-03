const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'linkify'
}


passport.use(new JWTStrategy(opts, async function(jwtPayLoad, done){
    try{
        let user_found = User.findById(jwtPayLoad._id);
        if(user_found){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    }
    catch(err){
        console.log(err);
    }
}));

module.exports = passport;