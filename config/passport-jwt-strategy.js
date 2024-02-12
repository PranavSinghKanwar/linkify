const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const env = require("./environment");
const User = require("../models/user");

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
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